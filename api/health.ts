export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
    hasSmtp: Boolean(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)),
    runtime: "Vercel Serverless Function",
    timestamp: new Date().toISOString(),
  });
}
