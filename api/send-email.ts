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
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        console.warn("Lỗi parse string body:", e);
      }
    }
    payload = payload || {};

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
    } = payload;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "error", message: "Địa chỉ email nhận không hợp lệ" });
    }

    const cleanSmtpUser = (process.env.SMTP_USER || "").trim();
    const cleanSmtpPass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "").trim();
    const hasRealSmtp = Boolean(cleanSmtpUser && cleanSmtpPass);

    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    console.log(`[VERCEL API] Gửi mail tới: ${email}, SMTP active: ${hasRealSmtp}, Resend active: ${Boolean(resend)}`);

    if (!resend && !hasRealSmtp) {
      return res.status(400).json({
        status: "needs_smtp_config",
        isRealDelivery: false,
        message:
          "Hệ thống chưa nhận được cấu hình gửi email trên Vercel. Vui lòng kiểm tra lại biến SMTP_USER, SMTP_PASS và bấm Redeploy trên Vercel.",
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

    // 1. Tạo buffer PDF: Ưu tiên dùng trực tiếp PDF Base64 chất lượng cao từ trình duyệt của người dùng
    let pdfBuffer: Buffer | null = null;
    if (pdfBase64 && typeof pdfBase64 === "string" && pdfBase64.length > 200) {
      try {
        const base64Clean = pdfBase64.includes("base64,")
          ? pdfBase64.split("base64,")[1]
          : pdfBase64;
        pdfBuffer = Buffer.from(base64Clean, "base64");
        console.log(`[PDF] Đã nạp trực tiếp PDF Base64 từ client thành công, dung lượng: ${pdfBuffer.length} bytes`);
      } catch (b64Err) {
        console.warn("Lỗi parse client base64 pdf:", b64Err);
      }
    }

    if (!pdfBuffer) {
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
        console.warn("Bỏ qua lỗi server PDF generation:", pdfErr);
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

    let lastError: any = null;

    // 3. NẾU CÓ CẤU HÌNH SMTP (GMAIL SMTP HOẶC MÁY CHỦ KHÁC) - ƯU TIÊN CHẠY SMTP TRƯỚC VÌ KHÔNG BỊ GIỚI HẠN ONBOARDING CỦA RESEND
    if (hasRealSmtp) {
      try {
        console.log(`[SMTP] Đang gửi qua SMTP (${cleanSmtpUser}) tới ${email}...`);
        const isGmail =
          (process.env.SMTP_HOST || "").toLowerCase().includes("gmail") ||
          cleanSmtpUser.toLowerCase().includes("@gmail.com");

        const transporter = isGmail
          ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: cleanSmtpUser,
                pass: cleanSmtpPass,
              },
            })
          : nodemailer.createTransport({
              host: process.env.SMTP_HOST || "smtp.gmail.com",
              port: Number(process.env.SMTP_PORT) || 465,
              secure:
                process.env.SMTP_SECURE === "true" ||
                !process.env.SMTP_PORT ||
                process.env.SMTP_PORT === "465",
              auth: {
                user: cleanSmtpUser,
                pass: cleanSmtpPass,
              },
            });

        const mailOptions: any = {
          from: `"AI Business Check-up" <${process.env.SMTP_FROM || cleanSmtpUser}>`,
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
        console.log(`[SMTP SUCCESS] Đã gửi thành công qua SMTP! ID: ${info.messageId}`);

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "smtp",
          message: `Báo cáo chiến lược cho doanh nghiệp "${businessName || "Doanh nghiệp"}" đã được chuyển phát thành công vào hộp thư ${email}!`,
          messageId: info.messageId,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: `${pdfFileSizeKb} KB`,
          timestamp: new Date().toISOString(),
        });
      } catch (smtpErr: any) {
        console.error("[SMTP ERROR]", smtpErr);
        lastError = smtpErr;
        // Nếu không có Resend để fallback, trả về lỗi chi tiết ngay để người dùng biết cách sửa
        if (!resend) {
          let errorExplanation = smtpErr.message || String(smtpErr);
          if (
            errorExplanation.includes("535") ||
            errorExplanation.includes("Username and Password not accepted") ||
            smtpErr.code === "EAUTH"
          ) {
            errorExplanation =
              "Lỗi xác thực Gmail (EAUTH 535): Google từ chối mật khẩu. Bạn cần tạo 'Mật khẩu ứng dụng' (App Password 16 chữ cái) trong tài khoản Google, không dùng mật khẩu đăng nhập Gmail thông thường.";
          }
          return res.status(400).json({
            status: "smtp_error",
            isRealDelivery: false,
            message: errorExplanation,
            detail: smtpErr.message,
            attachmentName: pdfFileName,
          });
        }
      }
    }

    // 4. NẾU CÓ RESEND API (CHẠY RESEND HOẶC FALLBACK TỪ SMTP)
    if (resend) {
      try {
        console.log(`[RESEND] Đang gửi qua Resend tới ${email}...`);
        const resendAttachments = pdfBuffer
          ? [
              {
                filename: pdfFileName,
                content: pdfBuffer,
              },
            ]
          : [];

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
            message: `Cổng Resend phản hồi: ${resendResult.error.message}`,
            detail: resendResult.error,
            attachmentName: pdfFileName,
          });
        }

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "resend",
          message: `Báo cáo chiến lược cho doanh nghiệp "${businessName || "Doanh nghiệp"}" đã được gửi thành công vào hộp thư ${email}!`,
          messageId: resendResult.data?.id,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: `${pdfFileSizeKb} KB`,
          timestamp: new Date().toISOString(),
        });
      } catch (resendEx: any) {
        console.error("Resend Exception:", resendEx);
        lastError = resendEx;
      }
    }

    return res.status(400).json({
      status: "error",
      message: lastError
        ? `Lỗi khi phát thư: ${lastError.message || String(lastError)}`
        : "Không thể gửi email qua các cổng đã cấu hình. Vui lòng kiểm tra lại thông tin cấu hình.",
    });
  } catch (error: any) {
    console.error("Lỗi tổng quát:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Lỗi máy chủ khi xử lý gửi email",
    });
  }
}
