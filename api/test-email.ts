import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const cleanSmtpUser = (process.env.SMTP_USER || "").trim();
  const cleanSmtpPass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "").trim();

  if (!cleanSmtpUser || !cleanSmtpPass) {
    return res.status(400).json({
      status: "error",
      message: "Chưa cấu hình SMTP_USER hoặc SMTP_PASS trên Vercel.",
      smtpUserConfigured: Boolean(cleanSmtpUser),
      smtpPassConfigured: Boolean(cleanSmtpPass),
    });
  }

  const configuredHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const isGmail =
    configuredHost.toLowerCase().includes("gmail") ||
    configuredHost.toLowerCase().includes("google") ||
    cleanSmtpUser.toLowerCase().includes("@gmail.com");

  try {
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

    // Verify connection configuration
    await transporter.verify();

    return res.json({
      status: "ok",
      message: "Kết nối máy chủ Gmail SMTP thành công 100%! Sẵn sàng gửi thư.",
      user: cleanSmtpUser.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      service: isGmail ? "Google Mail (Service Preset)" : "Custom SMTP",
    });
  } catch (err: any) {
    let explanation = err.message || String(err);
    if (explanation.includes("535") || explanation.includes("Username and Password not accepted") || err.code === "EAUTH") {
      explanation =
        "Google từ chối đăng nhập (EAUTH 535): Bạn cần vào Google Security tạo 'Mật khẩu ứng dụng' (App Password 16 chữ cái), không được dùng mật khẩu đăng nhập tài khoản.";
    }
    return res.status(400).json({
      status: "error",
      message: explanation,
      code: err.code,
    });
  }
}
