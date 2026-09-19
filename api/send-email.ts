import { Resend } from "resend";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";

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

function sanitizePdfText(str: string | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();
}

function generateExecutivePdfBuffer(data: ReportEmailData): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  const businessName = sanitizePdfText(data.businessName) || 'DOANH NGHIEP';
  const ceoName = sanitizePdfText(data.receiverName) || 'CEO / LANH DAO';
  const industry = sanitizePdfText(data.profile?.industry) || 'Thuong mai & Dich vu';
  const score = data.healthScore !== undefined ? data.healthScore : 72;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, 12, contentWidth, 24, 'F');

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AI BUSINESS HEALTH CHECK 2026 - EXECUTIVE STRATEGY REPORT', margin + 5, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`BAN DO CHIEN LUOC & DINH VI: ${businessName.toUpperCase()}`, margin + 5, 26);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nguoi nhan: ${ceoName} | Nganh: ${industry} | Thoi diem: ${new Date().toLocaleDateString('vi-VN')}`, margin + 5, 32);

  // Score Box
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CHI SO SUC KHOE', margin + 5, currentY + 6);

  const scoreColor = score >= 80 ? [22, 163, 74] : score >= 60 ? [29, 78, 216] : [234, 88, 12];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score}`, margin + 5, currentY + 16);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('/100', margin + 20, currentY + 14);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 36, currentY + 3, margin + 36, currentY + 19);

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NHAN DINH CHIEN LUOC TONG QUAN:', margin + 40, currentY + 6);

  const summary = sanitizePdfText(data.healthSummary) || 'Doanh nghiep co nen tang san pham tot nhung can tap trung toi uu hoa quy trinh giu chan khach hang va tu dong hoa van hanh.';
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const splitSummary = doc.splitTextToSize(`"${summary}"`, contentWidth - 45);
  doc.text(splitSummary, margin + 40, currentY + 11);

  // 5 Pillars
  currentY = 66;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DANH GIA 5 TRU COT NANG LUC DOANH NGHIEP (SCORECARD)', margin, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 34, 'FD');

  const pillars = [
    { label: 'Tai chinh & Dong tien (Cashflow & Unit Economics)', score: data.radarScores?.finance || 72 },
    { label: 'Van hanh & He thong (Operations & Process Automation)', score: data.radarScores?.operations || 65 },
    { label: 'Tiep thi & Khach hang (Marketing & Retention Engines)', score: data.radarScores?.marketing || 80 },
    { label: 'Doi ngu & Con nguoi (Team Alignment & Culture)', score: data.radarScores?.team || 68 },
    { label: 'Loi the canh tranh & San pham (Product Moat & IP)', score: data.radarScores?.advantage || 85 },
  ];

  let barY = currentY + 5;
  pillars.forEach((p) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(p.label, margin + 4, barY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 78, 216);
    doc.text(`${p.score}/100`, margin + 115, barY);

    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 130, barY - 2.5, 48, 3, 'F');

    const barWidth = (Math.min(100, Math.max(0, p.score)) / 100) * 48;
    doc.setFillColor(37, 99, 235);
    doc.rect(margin + 130, barY - 2.5, barWidth, 3, 'F');

    barY += 5.8;
  });

  // Action
  currentY = 108;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('2. HANH DONG DON BAY QUYET DINH TRONG 30 NGAY (IF ONLY ONE THING)', margin, currentY);

  currentY += 4;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, currentY, contentWidth, 18, 'FD');

  const ifOneThing = sanitizePdfText(data.ifOnlyOneThing?.action) || 'Khai thac toi da gia tri vong doi khach hang cu thong qua chuoi cham soc tu dong de tang bien loi nhuan gop ngay lap tuc.';
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DON BAY CHIEN LUOC:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(69, 26, 3);
  const splitOneThing = doc.splitTextToSize(ifOneThing, contentWidth - 10);
  doc.text(splitOneThing, margin + 4, currentY + 10);

  // Insights
  currentY = 134;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('3. TAM GIAC NHAN DINH CHIEN LUOC (STRATEGIC TRIANGLE)', margin, currentY);

  currentY += 4;
  const insights = [
    {
      title: 'DONG TIEN & HIEN TRANG',
      text: sanitizePdfText(data.threeKeyInsights?.greatestStrength) || 'Nguon thu on dinh nhung chi phi duy tri bo may can duoc tinh gon bang cong nghe.',
      bg: [239, 246, 255],
      border: [191, 219, 254],
      titleColor: [30, 64, 175],
    },
    {
      title: 'DIEM NGHEN COT LOI',
      text: sanitizePdfText(data.threeKeyInsights?.biggestBottleneck) || 'Quy trinh ban hang phu thuoc nhieu vao con nguoi, thieu he thong ghi nhan tu dong.',
      bg: [254, 242, 242],
      border: [254, 202, 202],
      titleColor: [153, 27, 27],
    },
    {
      title: 'CO HOI BUT PHA',
      text: sanitizePdfText(data.threeKeyInsights?.mostPromisingOpportunity) || 'Ung dung AI vao tu van va cham soc khach hang giup giam 40% thoi gian xu ly don hang.',
      bg: [240, 253, 244],
      border: [187, 247, 208],
      titleColor: [22, 101, 52],
    },
  ];

  insights.forEach((ins) => {
    doc.setFillColor(ins.bg[0], ins.bg[1], ins.bg[2]);
    doc.setDrawColor(ins.border[0], ins.border[1], ins.border[2]);
    doc.rect(margin, currentY, contentWidth, 15, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(ins.titleColor[0], ins.titleColor[1], ins.titleColor[2]);
    doc.text(ins.title, margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const splitIns = doc.splitTextToSize(ins.text, contentWidth - 8);
    doc.text(splitIns, margin + 4, currentY + 9);

    currentY += 17;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Bao cao chien luoc doc quyen danh cho CEO duoc tao boi AI Business Health Check Engine 2026. Bao mat tuyet doi.',
    pageWidth / 2,
    287,
    { align: 'center' }
  );

  return Buffer.from(doc.output('arraybuffer'));
}

function createExecutiveEmailHtml(data: ReportEmailData): string {
  const score = data.healthScore !== undefined ? data.healthScore : 74;
  const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : '#ea580c';
  const scoreBadgeBg = score >= 80 ? '#dcfce7' : score >= 60 ? '#dbeafe' : '#ffedd5';
  const scoreGrade = score >= 80 ? 'HẠNG A • KHỎE MẠNH VỮNG VÀNG' : score >= 60 ? 'HẠNG B • TIỀM NĂNG - CẦN TỐI ƯU' : 'HẠNG C • CẢNH BÁO NGUY CƠ';

  const radar = {
    finance: data.radarScores?.finance || 72,
    operations: data.radarScores?.operations || 65,
    marketing: data.radarScores?.marketing || 80,
    team: data.radarScores?.team || 68,
    advantage: data.radarScores?.advantage || 85,
  };

  const insights = {
    strength: data.threeKeyInsights?.greatestStrength || 'Sản phẩm có lợi thế cạnh tranh tự nhiên và tỷ lệ khách hàng hài lòng cao.',
    bottleneck: data.threeKeyInsights?.biggestBottleneck || 'Phụ thuộc vào khách mới, tỷ lệ quay lại mua hàng chưa được khai thác triệt để.',
    opportunity: data.threeKeyInsights?.mostPromisingOpportunity || 'Xây dựng phễu chăm sóc tự động và gói sản phẩm định kỳ (combo/membership).',
  };

  const action = {
    action: data.ifOnlyOneThing?.action || 'Kích hoạt chiến dịch gọi điện/nhắn tin chăm sóc 100 khách hàng cũ thân thiết nhất.',
    reason: data.ifOnlyOneThing?.reason || 'Chi phí giữ chân khách cũ chỉ bằng 1/5 chi phí tìm khách mới, tạo dòng tiền nóng ngay lập tức.',
    impact: data.ifOnlyOneThing?.impact || 'Dự kiến tăng ngay 15% - 25% doanh thu trong 30 ngày mà không tốn thêm ngân sách quảng cáo.',
  };

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bản Đồ Chiến Lược & Tư Vấn Điều Hành CEO - ${data.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 24px; border: 1px solid #cbd5e1; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%); padding: 36px 28px; text-align: left; border-bottom: 3px solid #2563eb;">
              <span style="display: inline-block; background-color: rgba(59,130,246,0.25); border: 1px solid rgba(147,197,253,0.3); color: #93c5fd; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;">
                ✦ AI BUSINESS HEALTH CHECK 2026
              </span>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0 0 8px 0;">
                BẢN ĐỒ CHIẾN LƯỢC & TƯ VẤN ĐIỀU HÀNH CEO
              </h1>
              <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                Báo cáo chẩn đoán dành riêng cho <strong>${data.receiverName || 'CEO'}</strong> • Doanh nghiệp: <strong style="color: #ffffff;">${data.businessName}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px 0 28px;">
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px; padding: 14px 18px; font-size: 12px; color: #1e3a8a;">
                📎 <strong>Tệp PDF đính kèm:</strong> ${data.pdfFileName || 'Bao_Cao_Chien_Luoc_CEO.pdf'} (${data.pdfFileSizeKb || 11} KB). Hãy cuộn xuống chân email để tải hoặc in trực tiếp.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px;">
                <tr>
                  <td width="120" align="center" style="vertical-align: middle; border-right: 1px solid #cbd5e1; padding-right: 16px;">
                    <div style="font-size: 10px; font-weight: 800; color: #64748b;">ĐIỂM SỨC KHỎE</div>
                    <div style="font-size: 40px; font-weight: 900; color: ${scoreColor}; margin: 4px 0;">${score}</div>
                    <div style="font-size: 10px; font-weight: 800; color: ${scoreColor}; background-color: ${scoreBadgeBg}; padding: 2px 6px; border-radius: 8px;">${scoreGrade}</div>
                  </td>
                  <td style="padding-left: 20px; vertical-align: middle;">
                    <div style="font-size: 11px; font-weight: 800; color: #2563eb;">✦ NHẬN ĐỊNH TỪ CHUYÊN GIA AI</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin-top: 6px; line-height: 1.5;">
                      “${data.healthSummary || 'Doanh nghiệp sở hữu nền tảng tốt, cần tập trung tối ưu dòng tiền và giữ chân khách hàng.'}”
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">📊 5 TRỤ CỘT NĂNG LỰC DOANH NGHIỆP</div>
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 18px; font-size: 12px; line-height: 2;">
                <div>• Tài chính & Dòng tiền: <strong>${radar.finance}/100</strong></div>
                <div>• Vận hành & Hệ thống: <strong>${radar.operations}/100</strong></div>
                <div>• Tiếp thị & Khách hàng: <strong>${radar.marketing}/100</strong></div>
                <div>• Đội ngũ & Nhân sự: <strong>${radar.team}/100</strong></div>
                <div>• Lợi thế cạnh tranh & SP: <strong>${radar.advantage}/100</strong></div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #fefce8; border: 2px solid #fde047; border-radius: 18px; padding: 18px;">
                <div style="font-size: 10px; font-weight: 900; color: #854d0e; text-transform: uppercase;">🎯 ĐÒN BẨY SỐ 1 TRONG 30 NGÀY TỚI</div>
                <div style="font-size: 15px; font-weight: 900; color: #713f12; margin: 6px 0;">${action.action}</div>
                <div style="font-size: 12px; color: #854d0e; margin-bottom: 6px;"><strong>Lý do:</strong> ${action.reason}</div>
                <div style="font-size: 12px; font-weight: 800; color: #15803d;">🚀 Kỳ vọng: ${action.impact}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">🔍 TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC</div>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px; margin-bottom: 8px; font-size: 12px;">
                <strong style="color: #166534;">🟢 Điểm mạnh lớn nhất:</strong> ${insights.strength}
              </div>
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 12px; margin-bottom: 8px; font-size: 12px;">
                <strong style="color: #991b1b;">🔴 Điểm nghẽn cần gỡ:</strong> ${insights.bottleneck}
              </div>
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 12px; font-size: 12px;">
                <strong style="color: #1e40af;">🔵 Cơ hội nhân doanh số:</strong> ${insights.opportunity}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 28px; text-align: center; color: #94a3b8; font-size: 11px;">
              AI BUSINESS HEALTH CHECK 2026 • Hệ thống chẩn đoán sức khỏe & chiến lược điều hành CEO độc lập.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default async function handler(req: any, res: any) {
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
        console.warn("Lỗi parse payload string:", e);
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
      healthScore,
      healthSummary,
      threeKeyInsights,
      ifOnlyOneThing,
      ninetyDayPlan,
      radarScores,
      profile,
    } = payload;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "error", message: "Địa chỉ email không hợp lệ" });
    }

    const cleanSmtpUser = (process.env.SMTP_USER || "").trim();
    const cleanSmtpPass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "").trim();
    const hasRealSmtp = Boolean(cleanSmtpUser && cleanSmtpPass);

    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    if (!resend && !hasRealSmtp) {
      return res.status(400).json({
        status: "needs_smtp_config",
        isRealDelivery: false,
        message: "Chưa cấu hình tài khoản gửi mail. Vui lòng cấu hình SMTP_USER và SMTP_PASS.",
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

    // Sinh file PDF độ nét cao bằng jsPDF (100% trong RAM, không đọc ổ đĩa)
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = generateExecutivePdfBuffer({
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
      console.warn("Lỗi sinh PDF:", pdfErr);
    }

    const pdfFileSizeKb = pdfBuffer ? Math.max(1, Math.round(pdfBuffer.length / 1024)) : 11;

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

    // 1. Ưu tiên gửi bằng Google Workspace / Gmail SMTP
    if (hasRealSmtp) {
      try {
        const configuredHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
        const configuredPort = Number(process.env.SMTP_PORT) || 465;
        const isSecure = configuredPort === 465 || process.env.SMTP_SECURE === "true";

        const transporter = nodemailer.createTransport({
          host: configuredHost,
          port: configuredPort,
          secure: isSecure,
          auth: {
            user: cleanSmtpUser,
            pass: cleanSmtpPass,
          },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 10000,
          tls: {
            rejectUnauthorized: false,
          },
        });

        const senderFrom = cleanSmtpUser.includes("<")
          ? cleanSmtpUser
          : `"AI Business Check-up" <${cleanSmtpUser}>`;

        const mailOptions: any = {
          from: senderFrom,
          to: email,
          subject: emailSubject,
          text: textContent || reportSummary || "Báo cáo chiến lược điều hành doanh nghiệp",
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
        if (!resend) {
          let errorExplanation = smtpErr.message || String(smtpErr);
          if (
            errorExplanation.includes("535") ||
            errorExplanation.includes("Username and Password not accepted") ||
            smtpErr.code === "EAUTH"
          ) {
            errorExplanation =
              "Lỗi xác thực Gmail (EAUTH 535): Google từ chối mật khẩu. Vui lòng kiểm tra lại 'Mật khẩu ứng dụng' (App Password 16 chữ cái) trong tài khoản Google.";
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

    // 2. Dự phòng Resend nếu SMTP thất bại
    if (resend) {
      try {
        const fromAddress = (process.env.RESEND_FROM || "onboarding@resend.dev").trim();
        const attachments = pdfBuffer
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
          attachments,
        });

        if (sendResult.error) {
          return res.status(400).json({
            status: "resend_error",
            isRealDelivery: false,
            message: `Cổng Resend phản hồi: ${sendResult.error.message}`,
            detail: sendResult.error,
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
