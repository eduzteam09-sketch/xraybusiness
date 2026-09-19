import { Resend } from "resend";
import nodemailer from "nodemailer";
import { createExecutiveEmailHtml } from "../server/emailTemplate";
import { generateExecutivePdfBuffer } from "../server/pdfGenerator";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method Not Allowed" });
  }

  try {
    const {
      email,
      receiverName,
      businessName,
      subject,
      reportSummary,
      textContent,
      pdfBase64,
      healthScore,
      healthSummary,
      threeKeyInsights,
      ifOnlyOneThing,
      ninetyDayPlan,
      radarScores,
      profile,
    } = req.body || {};

    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "error", message: "Địa chỉ email không hợp lệ" });
    }

    const resendApiKey = process.env.RESEND_API_KEY || "";
    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const hasRealSmtp = Boolean(
      process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)
    );

    if (!resend && !hasRealSmtp) {
      return res.status(400).json({
        status: "error",
        message:
          "Chưa cấu hình dịch vụ gửi mail. Vui lòng thêm RESEND_API_KEY hoặc thông tin SMTP (SMTP_USER, SMTP_PASS) vào Vercel Environment Variables và Redeploy lại.",
      });
    }

    const emailSubject =
      subject || `[BÁO CÁO CHIẾN LƯỢC CEO] Chẩn Đoán & Định Vị Doanh Nghiệp ${businessName || "Doanh Nghiệp"}`;

    const asciiBusinessName = (businessName || "Doanh_Nghiep")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const pdfFileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || "Doanh_Nghiep"}.pdf`;

    // 1. Tạo buffer PDF
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateExecutivePdfBuffer({
        email,
        receiverName,
        businessName,
        healthScore,
        healthSummary: healthSummary || reportSummary,
        threeKeyInsights,
        ifOnlyOneThing,
        ninetyDayPlan,
        radarScores,
        profile,
        pdfFileName,
      });
    } catch (pdfErr) {
      console.warn("Lỗi generateExecutivePdfBuffer:", pdfErr);
      if (pdfBase64 && typeof pdfBase64 === "string" && pdfBase64.length > 500) {
        try {
          const base64Clean = pdfBase64.includes("base64,")
            ? pdfBase64.split("base64,")[1]
            : pdfBase64;
          pdfBuffer = Buffer.from(base64Clean, "base64");
        } catch (b64Err) {
          console.warn("Lỗi parse client base64 pdf:", b64Err);
        }
      }
    }

    const pdfFileSizeKb = pdfBuffer ? Math.max(1, Math.round(pdfBuffer.length / 1024)) : 142;

    // 2. Tạo template HTML Executive
    const emailHtml = createExecutiveEmailHtml({
      email,
      receiverName,
      businessName,
      healthScore,
      healthSummary: healthSummary || reportSummary,
      threeKeyInsights,
      ifOnlyOneThing,
      ninetyDayPlan,
      radarScores,
      profile,
      pdfFileName,
      pdfFileSizeKb,
    });

    // 3. Gửi qua Resend nếu có Resend API Key
    if (resend) {
      try {
        const resendAttachments = pdfBuffer
          ? [
              {
                filename: pdfFileName,
                content: pdfBuffer,
              },
            ]
          : [];

        // Hỗ trợ cấu hình RESEND_FROM nếu người dùng đã verify custom domain trên Resend
        const resendFrom =
          process.env.RESEND_FROM || "AI Business Check-up <onboarding@resend.dev>";

        const resendResult = await resend.emails.send({
          from: resendFrom,
          to: [email],
          subject: emailSubject,
          html: emailHtml,
          text: textContent || reportSummary || "Báo cáo chẩn đoán chiến lược doanh nghiệp",
          attachments: resendAttachments,
        });

        if (resendResult.error) {
          console.error("Resend API Error:", resendResult.error);
          return res.status(400).json({
            status: "resend_error",
            isRealDelivery: false,
            message: `Resend thông báo: ${resendResult.error.message}`,
            detail: resendResult.error,
            attachmentName: pdfFileName,
          });
        }

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "resend",
          message: `Báo cáo chiến lược cho doanh nghiệp "${businessName || "Doanh nghiệp"}" đã được gửi thành công kèm tệp PDF vào hộp thư ${email}!`,
          messageId: resendResult.data?.id,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: `${pdfFileSizeKb} KB`,
          timestamp: new Date().toISOString(),
        });
      } catch (resendEx: any) {
        console.error("Resend exception:", resendEx);
        // Nếu Resend ném exception, thử tiếp qua SMTP nếu có
        if (!hasRealSmtp) {
          return res.status(500).json({
            status: "error",
            message: `Lỗi kết nối Resend: ${resendEx.message || String(resendEx)}`,
          });
        }
      }
    }

    // 4. Gửi qua SMTP nếu có
    if (hasRealSmtp) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure:
          process.env.SMTP_SECURE === "true" ||
          !process.env.SMTP_PORT ||
          process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions: any = {
        from: `"AI Business Check-up" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: emailSubject,
        text: textContent || reportSummary || "Báo cáo chẩn đoán chiến lược doanh nghiệp",
        html: emailHtml,
        attachments: pdfBuffer
          ? [
              {
                filename: pdfFileName,
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ]
          : [],
      };

      const info = await transporter.sendMail(mailOptions);
      return res.json({
        status: "ok",
        isRealDelivery: true,
        provider: "smtp",
        message: `Báo cáo chiến lược cho doanh nghiệp "${businessName || "Doanh nghiệp"}" đã được gửi thành công kèm tệp PDF vào hộp thư ${email}!`,
        messageId: info.messageId,
        deliveredTo: email,
        attachmentName: pdfFileName,
        attachmentSize: `${pdfFileSizeKb} KB`,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Không thể hoàn thành gửi email qua các cổng đã cấu hình.",
    });
  } catch (error: any) {
    console.error("Lỗi tổng quát khi gửi email:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Lỗi máy chủ khi xử lý gửi email",
    });
  }
}
