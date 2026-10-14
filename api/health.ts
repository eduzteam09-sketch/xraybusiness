export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const smtpUser = process.env.SMTP_USER || "";
  const maskedUser = smtpUser ? smtpUser.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "None";
  const hasSmtpPass = Boolean(process.env.SMTP_PASS || process.env.SMTP_PASSWORD);

  res.json({
    status: "ok",
    environment: "Vercel Serverless Function",
    services: {
      geminiAi: Boolean(process.env.GEMINI_API_KEY),
      resendCloud: Boolean(process.env.RESEND_API_KEY),
      smtpConfigured: Boolean(smtpUser && hasSmtpPass),
      smtpUser: maskedUser,
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    },
    timestamp: new Date().toISOString(),
  });
}
