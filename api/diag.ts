import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const cleanSmtpUser = (process.env.SMTP_USER || "").trim();
  const cleanSmtpPass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "").trim();

  const logs: string[] = [];
  logs.push(`SMTP_USER: ${cleanSmtpUser ? cleanSmtpUser.slice(0, 3) + "***" : "missing"}`);
  logs.push(`SMTP_PASS length: ${cleanSmtpPass.length}`);

  try {
    // 1. Thử gửi trực tiếp qua port 465
    logs.push("Khởi tạo transporter port 465...");
    const transporter465 = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: cleanSmtpUser,
        pass: cleanSmtpPass,
      },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 7000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    logs.push("Bắt đầu gửi thử mail tới eduzteam09@gmail.com...");
    const info = await transporter465.sendMail({
      from: cleanSmtpUser,
      to: "eduzteam09@gmail.com",
      subject: "[TEST] Kiem tra ket noi Gmail SMTP Vercel",
      text: "Test email tu Vercel Serverless Function",
    });

    logs.push(`Gui thanh cong! MessageId: ${info.messageId}`);
    return res.json({ status: "ok", message: "Gửi thư thành công 100%!", logs });
  } catch (err465: any) {
    logs.push(`Loi port 465: ${err465.message}`);

    // 2. Thu port 587
    try {
      logs.push("Thu port 587 STARTTLS...");
      const transporter587 = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: cleanSmtpUser,
          pass: cleanSmtpPass,
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 7000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info587 = await transporter587.sendMail({
        from: cleanSmtpUser,
        to: "eduzteam09@gmail.com",
        subject: "[TEST 587] Kiem tra ket noi Gmail SMTP Vercel",
        text: "Test email port 587 tu Vercel Serverless Function",
      });

      logs.push(`Gui thanh cong qua 587! MessageId: ${info587.messageId}`);
      return res.json({ status: "ok", message: "Gửi qua port 587 thành công!", logs });
    } catch (err587: any) {
      logs.push(`Loi port 587: ${err587.message}`);
      return res.status(500).json({ status: "error", logs });
    }
  }
}
