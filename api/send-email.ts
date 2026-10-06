import nodemailer from "nodemailer";
import { Resend } from "resend";

export interface ReportEmailData {
  email: string;
  receiverName?: string;
  businessName: string;
  healthScore?: number;
  healthSummary?: string;
  threeKeyInsights?: {
    greatestStrength?: string;
    biggestBottleneck?: string;
    mostPromisingOpportunity?: string;
  };
  ifOnlyOneThing?: {
    action?: string;
    reason?: string;
    impact?: string;
  };
  ninetyDayPlan?: Array<{
    timeline?: string;
    title?: string;
    objective?: string;
    kpi?: string;
    tasks?: string[];
  }>;
  radarScores?: {
    finance?: number;
    operations?: number;
    marketing?: number;
    team?: number;
    advantage?: number;
  };
  profile?: {
    industry?: string;
    currentRevenue?: string;
    teamSize?: string;
    mainProducts?: string;
    painPoint?: string;
  };
  pdfFileName?: string;
  pdfFileSizeKb?: number;
}

// Tạo giao diện Email HTML Executive sang trọng, hiện đại, tối ưu cho CEO
function createExecutiveEmailHtml(data: ReportEmailData): string {
  const bName = data.businessName || "Doanh Nghiệp";
  const rName = data.receiverName || "CEO / Lãnh Đạo";
  const score = data.healthScore !== undefined ? data.healthScore : 72;
  const ind = data.profile?.industry || "Thương mại & Dịch vụ";
  const fileName = data.pdfFileName || `Bao_Cao_Chien_Luoc_CEO_${bName.replace(/\s+/g, "_")}.pdf`;
  const fileSize = data.pdfFileSizeKb || 145;

  const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#2563eb" : "#ea580c";
  const scoreBadge = score >= 80 ? "SỨC KHỎE TỐT" : score >= 60 ? "TIỀM NĂNG - CẦN TỐI ƯU" : "CẦN TẬP TRUNG GỠ NGHẼN";

  const ifAction = data.ifOnlyOneThing?.action || "Tập trung kích hoạt lại tệp khách hàng cũ qua chuỗi chăm sóc tự động.";
  const ifReason = data.ifOnlyOneThing?.reason || "Chi phí bán lại cho khách cũ thấp hơn nhiều so với tìm kiếm khách mới.";
  const ifImpact = data.ifOnlyOneThing?.impact || "Tăng ngay 20-35% doanh thu định kỳ.";

  const strength = data.threeKeyInsights?.greatestStrength || "Chất lượng sản phẩm và sự hài lòng của khách hàng thân thiết.";
  const bottleneck = data.threeKeyInsights?.biggestBottleneck || "Quy trình bán hàng còn phụ thuộc nhân sự, thiếu hệ thống tự động nhắc mua lại.";
  const opportunity = data.threeKeyInsights?.mostPromisingOpportunity || "Ứng dụng AI và tự động hóa vào quy trình tư vấn, đóng gói giải pháp trọn gói.";

  const plans = data.ninetyDayPlan || [
    { timeline: "Ngày 1 - 30", title: "Bịt lỗ rò rỉ dòng tiền & Tái kích hoạt khách hàng cũ", objective: "Khóa chặt rò rỉ dữ liệu, kích hoạt khách hàng thân thiết", kpi: "Tăng 15% tỷ lệ mua lại" },
    { timeline: "Ngày 31 - 60", title: "Chuẩn hóa quy trình vận hành và ứng dụng AI tự động hóa", objective: "Đóng gói quy trình tư vấn và bàn giao", kpi: "Giảm 30% thời gian xử lý đơn hàng" },
    { timeline: "Ngày 61 - 90", title: "Mở rộng kênh tiếp cận và bứt phá quy mô", objective: "Nhân bản mô hình kinh doanh và mở rộng kênh", kpi: "Đạt mục tiêu tăng trưởng doanh số quý" },
  ];

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Báo Cáo Chiến Lược CEO - ${bName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- HEADER BANNER -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 28px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: rgba(255,255,255,0.15); color: #93c5fd; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      AI STRATEGY EXECUTIVE REPORT 2026
                    </span>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 12px 0 6px 0; letter-spacing: -0.3px;">
                      ${bName}
                    </h1>
                    <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                      Kính gửi: <strong>${rName}</strong> | Ngành: ${ind}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ATTACHMENT NOTICE BANNER -->
          <tr>
            <td style="background-color: #eff6ff; padding: 14px 28px; border-bottom: 1px solid #dbeafe;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="28" valign="middle">
                    <span style="font-size: 20px;">📎</span>
                  </td>
                  <td valign="middle" style="font-size: 13px; color: #1e40af; font-weight: 600;">
                    Tệp đính kèm: <strong>${fileName}</strong> (~${fileSize} KB) đã được đính kèm vào email này.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT BODY -->
          <tr>
            <td style="padding: 28px;">
              
              <!-- SCORE CARD -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px; text-align: center; border-right: 1px solid #e2e8f0;" width="140">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">CHỈ SỐ SỨC KHỎE</div>
                    <div style="font-size: 38px; font-weight: 900; color: ${scoreColor}; line-height: 1.1; margin: 4px 0;">
                      ${score}<span style="font-size: 16px; color: #94a3b8; font-weight: 600;">/100</span>
                    </div>
                    <span style="display: inline-block; background-color: #ffffff; border: 1px solid ${scoreColor}; color: ${scoreColor}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
                      ${scoreBadge}
                    </span>
                  </td>
                  <td style="padding: 20px;" valign="middle">
                    <div style="font-size: 12px; font-weight: 700; color: #3b82f6; text-transform: uppercase; margin-bottom: 4px;">NHẬN ĐỊNH TỔNG QUAN</div>
                    <div style="font-size: 13.5px; color: #334155; line-height: 1.5;">
                      ${data.healthSummary || "Doanh nghiệp có nền tảng cốt lõi vững chắc, cần tập trung kích hoạt đòn bẩy dòng tiền để tối đa hóa hiệu quả hoạt động."}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- IF ONLY ONE THING (ĐÒN BẨY SỐ 1) -->
              <div style="background-color: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                  ⚡ HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY (NẾU CHỈ LÀM 1 VIỆC)
                </div>
                <div style="font-size: 14.5px; font-weight: 700; color: #78350f; margin-bottom: 8px;">
                  👉 ${ifAction}
                </div>
                <div style="font-size: 12.5px; color: #92400e; margin-bottom: 4px;">
                  <strong>Lý do chiến lược:</strong> ${ifReason}
                </div>
                <div style="font-size: 12.5px; color: #15803d; font-weight: 600;">
                  <strong>Kỳ vọng tác động:</strong> ${ifImpact}
                </div>
              </div>

              <!-- STRATEGIC TRIANGLE -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                  🎯 TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 12px 14px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 8px; display: block;">
                      <div style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase;">01. SỨC MẠNH LỚN NHẤT (ĐIỂM TỰA TĂNG TRƯỞNG)</div>
                      <div style="font-size: 13px; color: #14532d; margin-top: 2px;">${strength}</div>
                    </td>
                  </tr>
                  <tr><td height="8"></td></tr>
                  <tr>
                    <td style="padding: 12px 14px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin-bottom: 8px; display: block;">
                      <div style="font-size: 11px; font-weight: 800; color: #991b1b; text-transform: uppercase;">02. ĐIỂM NGHẼN CỐT LÕI (RÒ RỈ CẦN BỊT NGAY)</div>
                      <div style="font-size: 13px; color: #7f1d1d; margin-top: 2px;">${bottleneck}</div>
                    </td>
                  </tr>
                  <tr><td height="8"></td></tr>
                  <tr>
                    <td style="padding: 12px 14px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; display: block;">
                      <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">03. CƠ HỘI ĐÁNG GIÁ NHẤT (BỨT PHÁ DOANH SỐ)</div>
                      <div style="font-size: 13px; color: #1e3a8a; margin-top: 2px;">${opportunity}</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- 90-DAY PLAN SUMMARY -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                  🗓️ LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO
                </div>
                ${plans.slice(0, 3).map((p, idx) => `
                  <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 8px; background-color: #ffffff;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 10px; font-weight: 800; color: #2563eb; background-color: #dbeafe; padding: 2px 8px; border-radius: 6px;">
                            ${p.timeline || `Giai đoạn 0${idx + 1}`}
                          </span>
                          <span style="font-size: 13px; font-weight: 700; color: #0f172a; margin-left: 8px;">
                            ${p.title}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 6px; font-size: 12px; color: #475569;">
                          • Mục tiêu: ${p.objective}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 3px; font-size: 12px; color: #16a34a; font-weight: 600;">
                          • KPI đo lường: ${p.kpi}
                        </td>
                      </tr>
                    </table>
                  </div>
                `).join("")}
              </div>

              <!-- FOOTER NOTE -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center;">
                <p style="margin: 0 0 6px 0;">
                  Báo cáo độc quyền dành cho CEO được tạo bởi <strong>AI Business Health Check Engine 2026</strong>.
                </p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                  Tất cả thông tin được bảo mật và chuẩn hóa theo phương pháp luận TOC (Theory of Constraints) & Strategy Canvas.
                </p>
              </div>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Chỉ hỗ trợ phương thức POST" });
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

    const cleanSmtpUser = (process.env.SMTP_USER || "").trim();
    const cleanSmtpPass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "").trim();
    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();

    const hasRealSmtp = Boolean(cleanSmtpUser && cleanSmtpPass);
    const hasResend = Boolean(resendApiKey);

    if (!hasRealSmtp && !hasResend) {
      return res.status(400).json({
        status: "needs_smtp_config",
        isRealDelivery: false,
        message: "Chưa cấu hình tài khoản gửi mail. Vui lòng cấu hình SMTP_USER và SMTP_PASS.",
      });
    }

    const bName = businessName || "Doanh Nghiệp";
    const asciiBusinessName = bName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");

    const pdfFileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || "Doanh_Nghiep"}.pdf`;

    // Giải mã file PDF vector đính kèm từ frontend gửi lên
    let pdfBuffer: Buffer | null = null;
    if (pdfBase64 && typeof pdfBase64 === "string" && pdfBase64.length > 200) {
      try {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "").trim();
        pdfBuffer = Buffer.from(cleanBase64, "base64");
      } catch (err) {
        console.warn("Lỗi decode base64:", err);
      }
    }

    const pdfFileSizeKb = pdfBuffer ? Math.max(1, Math.round(pdfBuffer.length / 1024)) : 145;

    const emailSubject = subject || `[BÁO CÁO CHIẾN LƯỢC CEO] Chẩn Đoán & Định Vị Doanh Nghiệp ${bName}`;
    const emailHtml = createExecutiveEmailHtml({
      email,
      receiverName,
      businessName: bName,
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

    const attachments = pdfBuffer
      ? [
          {
            filename: pdfFileName,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : [];

    // 1. ƯU TIÊN GỬI QUA GMAIL SMTP VỚI SERVICE PRESET (Giống test-email.ts, kết nối 100% ổn định)
    if (hasRealSmtp) {
      try {
        const configuredHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
        const isGmail =
          configuredHost.toLowerCase().includes("gmail") ||
          configuredHost.toLowerCase().includes("google") ||
          cleanSmtpUser.toLowerCase().includes("@gmail.com");

        const transporter = isGmail
          ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: cleanSmtpUser,
                pass: cleanSmtpPass,
              },
              tls: {
                rejectUnauthorized: false,
              },
            })
          : nodemailer.createTransport({
              host: configuredHost,
              port: Number(process.env.SMTP_PORT) || 465,
              secure:
                process.env.SMTP_SECURE === "true" ||
                !process.env.SMTP_PORT ||
                process.env.SMTP_PORT === "465",
              auth: {
                user: cleanSmtpUser,
                pass: cleanSmtpPass,
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

        const senderFrom = cleanSmtpUser.includes("<")
          ? cleanSmtpUser
          : `"AI Business Health Check" <${cleanSmtpUser}>`;

        const mailOptions: any = {
          from: senderFrom,
          to: email,
          subject: emailSubject,
          text: textContent || reportSummary || "Báo cáo chiến lược điều hành doanh nghiệp",
          html: emailHtml,
          attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[SMTP SUCCESS] Đã gửi thành công qua SMTP! ID: ${info.messageId}`);

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "smtp",
          message: `Báo cáo chiến lược cho "${bName}" đã được chuyển phát thành công vào hộp thư ${email}!`,
          messageId: info.messageId,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: `${pdfFileSizeKb} KB`,
          timestamp: new Date().toISOString(),
        });
      } catch (smtpErr: any) {
        console.error("[SMTP ERROR]", smtpErr);
        if (!hasResend) {
          let errorExplanation = smtpErr.message || String(smtpErr);
          if (
            errorExplanation.includes("535") ||
            errorExplanation.includes("Username and Password not accepted") ||
            smtpErr.code === "EAUTH"
          ) {
            errorExplanation =
              "Lỗi xác thực Gmail (EAUTH 535): Google từ chối mật khẩu. Vui lòng dùng 'Mật khẩu ứng dụng' (App Password 16 chữ cái) trong tài khoản Google Security.";
          }
          return res.status(400).json({
            status: "smtp_error",
            isRealDelivery: false,
            message: errorExplanation,
            detail: smtpErr.message,
          });
        }
      }
    }

    // 2. Dự phòng Resend API nếu có cấu hình
    if (hasResend) {
      try {
        const resend = new Resend(resendApiKey);
        const fromAddress = (process.env.RESEND_FROM || "onboarding@resend.dev").trim();
        const resendAttachments = pdfBuffer
          ? [
              {
                filename: pdfFileName,
                content: pdfBuffer.toString("base64"),
              },
            ]
          : [];

        const sendResult = await resend.emails.send({
          from: fromAddress.includes("<") ? fromAddress : `AI Business Check-up <${fromAddress}>`,
          to: [email],
          subject: emailSubject,
          html: emailHtml,
          text: textContent || reportSummary || "Báo cáo chiến lược điều hành doanh nghiệp",
          attachments: resendAttachments,
        });

        if (sendResult.error) {
          return res.status(400).json({
            status: "resend_error",
            isRealDelivery: false,
            message: `Cổng Resend phản hồi: ${sendResult.error.message}`,
          });
        }

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "resend",
          message: `Báo cáo chiến lược đã được chuyển phát thành công vào hộp thư ${email}!`,
          messageId: sendResult.data?.id,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: `${pdfFileSizeKb} KB`,
          timestamp: new Date().toISOString(),
        });
      } catch (resendCatchErr: any) {
        return res.status(500).json({
          status: "resend_failed",
          isRealDelivery: false,
          message: resendCatchErr.message || "Lỗi khi gửi qua Resend",
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: "Không thể gửi email bằng bất kỳ phương thức nào.",
    });
  } catch (globalErr: any) {
    console.error("[GLOBAL API ERROR]", globalErr);
    return res.status(500).json({
      status: "internal_error",
      message: globalErr.message || "Lỗi máy chủ nội bộ khi xử lý gửi email.",
    });
  }
}
