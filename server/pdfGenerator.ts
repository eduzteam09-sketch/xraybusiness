import { jsPDF } from 'jspdf';
import { ReportEmailData } from './emailTemplate';

// Hàm làm sạch chuỗi Unicode sang ký tự tiêu chuẩn để in trong PDF tiêu chuẩn không lỗi phông
function sanitizePdfText(str: string | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();
}

export async function generateExecutivePdfBuffer(data: ReportEmailData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm

  const businessName = sanitizePdfText(data.businessName) || 'DOANH NGHIEP';
  const ceoName = sanitizePdfText(data.receiverName) || 'CEO / LANH DAO';
  const industry = sanitizePdfText(data.profile?.industry) || 'Thuong mai & Dich vu';
  const score = data.healthScore !== undefined ? data.healthScore : 72;

  // 1. HEADER BANNER (Navy sẫm)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(margin, 12, contentWidth, 24, 'F');

  doc.setTextColor(147, 197, 253); // #93c5fd
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AI BUSINESS HEALTH CHECK 2026 - EXECUTIVE STRATEGY REPORT', margin + 5, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`BAN DO CHIEN LUOC & DINH VI: ${businessName.toUpperCase()}`, margin + 5, 26);

  doc.setTextColor(203, 213, 225); // #cbd5e1
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nguoi nhan: ${ceoName} | Nganh: ${industry} | Thoi diem: ${new Date().toLocaleDateString('vi-VN')}`, margin + 5, 32);

  // 2. HEALTH SCORE BOX
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 22, 'FD');

  // Score badge
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

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 36, currentY + 3, margin + 36, currentY + 19);

  // Summary quote
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

  // 3. 5 PILLARS ASSESSMENT
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

    // Bar background
    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 130, barY - 2.5, 48, 3, 'F');

    // Bar progress
    const barWidth = (Math.min(100, Math.max(0, p.score)) / 100) * 48;
    doc.setFillColor(37, 99, 235);
    doc.rect(margin + 130, barY - 2.5, barWidth, 3, 'F');

    barY += 5.8;
  });

  // 4. HIGHEST LEVERAGE ACTION (IF ONLY ONE THING)
  currentY = 108;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('2. HANH DONG DON BAY QUYET DINH TRONG 30 NGAY (IF ONLY ONE THING)', margin, currentY);

  currentY += 4;
  doc.setFillColor(254, 243, 199); // #fef3c7 amber-100
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, currentY, contentWidth, 18, 'FD');

  const ifOneThing = sanitizePdfText(data.ifOnlyOneThing) || 'Khai thac toi da gia tri vong doi khach hang cu thong qua chuoi cham soc tu dong de tang bien loi nhuan gop ngay lap tuc.';
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DON BAY CHIEN LUOC:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(69, 26, 3);
  const splitOneThing = doc.splitTextToSize(ifOneThing, contentWidth - 10);
  doc.text(splitOneThing, margin + 4, currentY + 10);

  // 5. THREE KEY INSIGHTS
  currentY = 134;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('3. TAM GIAC NHAN DINH CHIEN LUOC (STRATEGIC TRIANGLE)', margin, currentY);

  currentY += 4;
  const insights = [
    {
      title: 'DONG TIEN & HIEN TRANG',
      text: sanitizePdfText(data.threeKeyInsights?.currentState) || 'Nguon thu on dinh nhung chi phi duy tri bo may can duoc tinh gon bang cong nghe.',
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
      text: sanitizePdfText(data.threeKeyInsights?.goldenOpportunity) || 'Ung dung AI vao tu van va cham soc khach hang giup giam 40% thoi gian xu ly don hang.',
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

  // 6. 90-DAY ACTION PLAN
  currentY += 2;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('4. LO TRINH HANH DONG 90 NGAY CUA CEO (90-DAY EXECUTION ROADMAP)', margin, currentY);

  currentY += 4;
  const phases = [
    {
      label: 'GIAI DOAN 1 (NGAY 1 - 30): BIT LO RO RI',
      action: sanitizePdfText(data.ninetyDayPlan?.phase1) || 'Thanh loc chi phi thua, toi uu conversion rate phan dau pheu, ra soat cong no.',
    },
    {
      label: 'GIAI DOAN 2 (NGAY 31 - 60): CHUAN HOA HE THONG',
      action: sanitizePdfText(data.ninetyDayPlan?.phase2) || 'Dong goi SOP van hanh, tich hop cong cu AI ho tro CSKH, xay dung KPI minh bach.',
    },
    {
      label: 'GIAI DOAN 3 (NGAY 61 - 90): TANG TRUONG & TANG TOC',
      action: sanitizePdfText(data.ninetyDayPlan?.phase3) || 'Mo rong kenh tiep can moi, ung dung don bay tai chinh an toan va dao tao ke thua.',
    },
  ];

  phases.forEach((phase) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, 14, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(phase.label, margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitPhase = doc.splitTextToSize(phase.action, contentWidth - 8);
    doc.text(splitPhase, margin + 4, currentY + 9);

    currentY += 16;
  });

  // FOOTER
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
