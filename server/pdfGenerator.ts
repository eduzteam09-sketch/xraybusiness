import { jsPDF } from 'jspdf';
import { ReportEmailData } from './emailTemplate';
import { setupVietnameseFont } from '../src/services/vietnameseFont';

export async function generateExecutivePdfBuffer(data: ReportEmailData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  setupVietnameseFont(doc);

  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm

  const businessName = (data.businessName || 'DOANH NGHIỆP').trim();
  const ceoName = (data.receiverName || 'CEO / LÃNH ĐẠO').trim();
  const industry = (data.profile?.industry || 'Thương mại & Dịch vụ').trim();
  const score = data.healthScore !== undefined ? data.healthScore : 72;

  // 1. HEADER BANNER (Navy sẫm)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(margin, 12, contentWidth, 24, 'F');

  doc.setTextColor(147, 197, 253); // #93c5fd
  doc.setFontSize(7.5);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('AI BUSINESS HEALTH CHECK 2026 - EXECUTIVE STRATEGY REPORT', margin + 5, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('DejaVuSans', 'bold');
  doc.text(`BẢN ĐỒ CHIẾN LƯỢC & ĐỊNH VỊ: ${businessName.toUpperCase()}`, margin + 5, 26);

  doc.setTextColor(203, 213, 225); // #cbd5e1
  doc.setFontSize(7.5);
  doc.setFont('DejaVuSans', 'normal');
  doc.text(`Người nhận: ${ceoName} | Ngành: ${industry} | Thời điểm: ${new Date().toLocaleDateString('vi-VN')}`, margin + 5, 32);

  // 2. HEALTH SCORE BOX
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 22, 'FD');

  // Score badge
  doc.setFont('DejaVuSans', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CHỈ SỐ SỨC KHỎE', margin + 5, currentY + 6);

  const scoreColor = score >= 80 ? [22, 163, 74] : score >= 60 ? [29, 78, 216] : [234, 88, 12];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(20);
  doc.setFont('DejaVuSans', 'bold');
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
  doc.setFont('DejaVuSans', 'bold');
  doc.text('NHẬN ĐỊNH CHIẾN LƯỢC TỔNG QUAN:', margin + 40, currentY + 6);

  const summary = (data.healthSummary || 'Doanh nghiệp đang có nền tảng sản phẩm tốt nhưng cần tập trung tối ưu hóa quy trình giữ chân khách hàng và tự động hóa vận hành.').trim();
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('DejaVuSans', 'normal');
  const splitSummary = doc.splitTextToSize(`"${summary}"`, contentWidth - 45);
  doc.text(splitSummary, margin + 40, currentY + 11);

  // 1. MA TRẬN 10 TRỤC NĂNG LỰC CẠNH TRANH (THANG ĐIỂM 1 - 5)
  currentY = 66;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('1. BẢNG MA TRẬN 10 TRỤC NĂNG LỰC CẠNH TRANH (THANG ĐIỂM 1 - 5)', margin, currentY);

  currentY += 4;
  const matrixBoxHeight = 44;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, matrixBoxHeight, 'FD');

  const defaultAxes = [
    { subject: 'USP khác biệt', label: '1. USP khác biệt vượt trội', score: 4.0, benchmark: 3.5 },
    { subject: 'Nhóm khách lợi nhuận', label: '2. Nhóm khách tạo 80% lợi nhuận', score: 3.5, benchmark: 3.2 },
    { subject: 'Thấu hiểu Insight', label: '3. Thấu hiểu nỗi đau khách hàng', score: 4.0, benchmark: 3.0 },
    { subject: 'Dễ dàng tìm thấy', label: '4. Hiện diện số & Dễ tìm thấy', score: 2.0, benchmark: 3.4 },
    { subject: 'Internet -> Doanh thu', label: '5. Phễu Online ra Doanh thu', score: 2.0, benchmark: 3.5 },
    { subject: 'Cơ chế mua lại', label: '6. Tự động nhắc nhở mua lại', score: 2.0, benchmark: 3.2 },
    { subject: 'Cross-sell / Upsell', label: '7. Chiến lược Combo & Bán thêm', score: 2.5, benchmark: 3.0 },
    { subject: 'Dữ liệu khách hàng', label: '8. Thu thập & Khai thác dữ liệu', score: 1.5, benchmark: 3.2 },
    { subject: 'Tăng trưởng không tăng NS', label: '9. Tăng trưởng không tăng NS', score: 3.0, benchmark: 2.8 },
    { subject: 'Dễ dàng nhân bản', label: '10. Khả năng đóng gói & Nhân bản', score: 3.0, benchmark: 3.0 },
  ];

  const rawRadar = data.radarScores;
  const axesList: any[] = [];

  if (Array.isArray(rawRadar) && rawRadar.length > 0) {
    rawRadar.forEach((r: any, idx: number) => {
      const rawScore = typeof r.score === 'number' ? r.score : 3.0;
      const sc = rawScore > 5 ? Math.round((rawScore / 20) * 10) / 10 : Math.round(rawScore * 10) / 10;
      const bm = typeof r.benchmark === 'number' ? r.benchmark : 3.0;
      const lbl = (r.subject || r.vietnameseFull || `Trục ${idx + 1}`).replace(/^\([0-9]+\)\s*/, `${idx + 1}. `).trim();
      axesList.push({
        label: lbl,
        score: sc,
        benchmark: bm,
        isLeak: sc <= 2.0,
      });
    });
  } else {
    defaultAxes.forEach((a) => {
      axesList.push({ ...a, isLeak: a.score <= 2.0 });
    });
  }

  while (axesList.length < 10) {
    const nextIdx = axesList.length;
    const fallback = defaultAxes[nextIdx] || { label: `${nextIdx + 1}. Năng lực bổ trợ`, score: 3.0, benchmark: 3.0, isLeak: false };
    axesList.push(fallback);
  }

  const colWidth = (contentWidth - 6) / 2;
  const leftColX = margin + 3;
  const rightColX = margin + colWidth + 5;
  const maxBarWidth = 22;

  for (let i = 0; i < 5; i++) {
    const rowY = currentY + 4 + i * 8;

    // Cột trái: Trục 1..5
    const leftItem = axesList[i];
    if (leftItem) {
      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(leftItem.isLeak ? 190 : 30, leftItem.isLeak ? 18 : 41, leftItem.isLeak ? 60 : 59);
      const shortLeftLabel = leftItem.label.length > 27 ? leftItem.label.slice(0, 26) + '…' : leftItem.label;
      doc.text(shortLeftLabel, leftColX, rowY + 2.5);

      if (leftItem.isLeak) {
        doc.setFillColor(255, 228, 230);
        doc.rect(leftColX + 41, rowY, 15, 3.5, 'F');
        doc.setFontSize(5.5);
        doc.setTextColor(190, 18, 60);
        doc.text('⚠️ RÒ RỈ', leftColX + 42, rowY + 2.6);
      }

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(leftItem.isLeak ? 225 : 29, leftItem.isLeak ? 29 : 78, leftItem.isLeak ? 72 : 216);
      doc.text(`${leftItem.score.toFixed(1)}/5`, leftColX + 58, rowY + 2.5);

      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`(C:${leftItem.benchmark})`, leftColX + 66, rowY + 2.5);

      doc.setFillColor(226, 232, 240);
      doc.rect(leftColX + 58, rowY + 3.8, maxBarWidth, 2, 'F');
      const leftBarW = (Math.min(5, Math.max(0, leftItem.score)) / 5) * maxBarWidth;
      doc.setFillColor(leftItem.isLeak ? 239 : 37, leftItem.isLeak ? 68 : 99, leftItem.isLeak ? 68 : 235);
      doc.rect(leftColX + 58, rowY + 3.8, leftBarW, 2, 'F');
    }

    // Cột phải: Trục 6..10
    const rightItem = axesList[i + 5];
    if (rightItem) {
      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(rightItem.isLeak ? 190 : 30, rightItem.isLeak ? 18 : 41, rightItem.isLeak ? 60 : 59);
      const shortRightLabel = rightItem.label.length > 27 ? rightItem.label.slice(0, 26) + '…' : rightItem.label;
      doc.text(shortRightLabel, rightColX, rowY + 2.5);

      if (rightItem.isLeak) {
        doc.setFillColor(255, 228, 230);
        doc.rect(rightColX + 41, rowY, 15, 3.5, 'F');
        doc.setFontSize(5.5);
        doc.setTextColor(190, 18, 60);
        doc.text('⚠️ RÒ RỈ', rightColX + 42, rowY + 2.6);
      }

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(rightItem.isLeak ? 225 : 29, rightItem.isLeak ? 29 : 78, rightItem.isLeak ? 72 : 216);
      doc.text(`${rightItem.score.toFixed(1)}/5`, rightColX + 58, rowY + 2.5);

      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`(C:${rightItem.benchmark})`, rightColX + 66, rowY + 2.5);

      doc.setFillColor(226, 232, 240);
      doc.rect(rightColX + 58, rowY + 3.8, maxBarWidth, 2, 'F');
      const rightBarW = (Math.min(5, Math.max(0, rightItem.score)) / 5) * maxBarWidth;
      doc.setFillColor(rightItem.isLeak ? 239 : 37, rightItem.isLeak ? 68 : 99, rightItem.isLeak ? 68 : 235);
      doc.rect(rightColX + 58, rowY + 3.8, rightBarW, 2, 'F');
    }
  }

  doc.setDrawColor(241, 245, 249);
  doc.line(margin + colWidth + 2, currentY + 3, margin + colWidth + 2, currentY + matrixBoxHeight - 3);

  // 2. HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY
  currentY = currentY + matrixBoxHeight + 5;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('2. HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY (IF ONLY ONE THING)', margin, currentY);

  currentY += 4;
  const actionBoxHeight = 24;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, currentY, contentWidth, actionBoxHeight, 'FD');

  const ifOneThing = (data.ifOnlyOneThing?.action || 'Khai thác tối đa giá trị vòng đời khách hàng cũ thông qua chuỗi chăm sóc tự động để tăng biên lợi nhuận gộp ngay lập tức.').trim();
  const ifOneReason = (data.ifOnlyOneThing?.reason || 'Chi phí tái kích hoạt khách cũ chỉ bằng 1/5 chi phí tìm khách hàng mới.').trim();
  const ifOneImpact = (data.ifOnlyOneThing?.impact || 'Tăng ngay 20-35% doanh thu định kỳ mà không cần tăng ngân sách quảng cáo.').trim();

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(7.5);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('👉 ĐÒN BẨY SỐ 1:', margin + 4, currentY + 5);

  doc.setFont('DejaVuSans', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  const splitOneThing = doc.splitTextToSize(ifOneThing, contentWidth - 35);
  doc.text(splitOneThing, margin + 30, currentY + 5);

  doc.setFont('DejaVuSans', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(146, 64, 14);
  const splitReason = doc.splitTextToSize(`• Lý do chiến lược: ${ifOneReason}`, contentWidth - 8);
  doc.text(splitReason, margin + 4, currentY + 13);

  doc.setFont('DejaVuSans', 'bold');
  doc.setTextColor(21, 128, 61);
  const splitImpact = doc.splitTextToSize(`• Kỳ vọng tác động: ${ifOneImpact}`, contentWidth - 8);
  doc.text(splitImpact, margin + 4, currentY + 19);

  // 3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC
  currentY = currentY + actionBoxHeight + 5;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC (STRATEGIC TRIANGLE)', margin, currentY);

  currentY += 4;
  const insights = [
    {
      title: '01. DÒNG TIỀN & HIỆN TRẠNG (ĐIỂM MẠNH LỚN NHẤT)',
      text: (data.threeKeyInsights?.greatestStrength || 'Nguồn thu ổn định từ khách hàng hài lòng, sản phẩm cốt lõi có chất lượng vững chắc.').trim(),
      bg: [240, 253, 244],
      border: [187, 247, 208],
      titleColor: [22, 101, 52],
    },
    {
      title: '02. ĐIỂM NGHẼN CỐT LÕI (RÒ RỈ CẦN GỠ BỎ NGAY)',
      text: (data.threeKeyInsights?.biggestBottleneck || 'Quy trình bán hàng phụ thuộc nhiều vào nhân sự, thiếu hệ thống tự động ghi nhận và nhắc nhở mua lại.').trim(),
      bg: [254, 242, 242],
      border: [254, 202, 202],
      titleColor: [153, 27, 27],
    },
    {
      title: '03. CƠ HỘI ĐÁNG GIÁ NHẤT (BỨT PHÁ QUY MÔ & DOANH SỐ)',
      text: (data.threeKeyInsights?.mostPromisingOpportunity || 'Ứng dụng tự động hóa & AI vào kênh chăm sóc khách hàng và bán thêm combo dịch vụ giúp tối ưu lợi nhuận.').trim(),
      bg: [239, 246, 255],
      border: [191, 219, 254],
      titleColor: [30, 64, 175],
    },
  ];

  insights.forEach((ins) => {
    doc.setFillColor(ins.bg[0], ins.bg[1], ins.bg[2]);
    doc.setDrawColor(ins.border[0], ins.border[1], ins.border[2]);
    doc.rect(margin, currentY, contentWidth, 14.5, 'FD');

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(ins.titleColor[0], ins.titleColor[1], ins.titleColor[2]);
    doc.text(ins.title, margin + 4, currentY + 4.5);

    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    const splitIns = doc.splitTextToSize(ins.text, contentWidth - 8);
    doc.text(splitIns, margin + 4, currentY + 9.2);

    currentY += 16.5;
  });

  // Footer Trang 1
  doc.setFont('DejaVuSans', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Trang 1/2 • Báo cáo chiến lược độc quyền dành cho CEO • AI Business Health Check Engine 2026 • Bảo mật tuyệt đối.',
    pageWidth / 2,
    287,
    { align: 'center' }
  );

  // ==========================================
  // TRANG 2: LỘ TRÌNH 90 NGÀY & KIỂM ĐỊNH HỆ THỐNG
  // ==========================================
  doc.addPage();

  // Mini Header Trang 2
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, 12, contentWidth, 14, 'F');

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(7);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('AI BUSINESS HEALTH CHECK 2026 - CHI TIẾT THỰC THI & LỘ TRÌNH HÀNH ĐỘNG', margin + 5, 17);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont('DejaVuSans', 'bold');
  doc.text(`BẢN ĐỒ CHIẾN LƯỢC & ĐỊNH VỊ: ${businessName.toUpperCase()} (TRANG 2/2)`, margin + 5, 23);

  // 4. LỘ TRÌNH 3 GIAI ĐOẠN 90 NGÀY CỦA CEO
  currentY = 32;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('4. LỘ TRÌNH THỰC THI 3 GIAI ĐOẠN 90 NGÀY CỦA CEO (90-DAY EXECUTION ROADMAP)', margin, currentY);

  currentY += 4;
  const planArr = Array.isArray(data.ninetyDayPlan) ? data.ninetyDayPlan : [];
  const phases = [
    {
      phase: 'GIAI ĐOẠN 1 (NGÀY 1 - 30): BÍT LỖ RÒ RỈ DÒNG TIỀN',
      title: (planArr[0]?.title || 'Tối ưu conversion rate và kiểm soát thất thoát khách hàng').trim(),
      objective: (planArr[0]?.objective || 'Rà soát danh sách khách cũ, kích hoạt chuỗi tin nhắn Zalo chăm sóc tự động và thu hồi công nợ.').trim(),
      kpi: (planArr[0]?.kpi || 'Tăng 15% doanh thu mua lại, giảm 20% chi phí lãng phí').trim(),
      timeline: (planArr[0]?.timeline || 'Ngày 1 - 30').trim(),
    },
    {
      phase: 'GIAI ĐOẠN 2 (NGÀY 31 - 60): CHUẨN HÓA & ĐÓNG GÓI HỆ THỐNG',
      title: (planArr[1]?.title || 'Chuẩn hóa quy trình vận hành và ứng dụng AI tự động hóa').trim(),
      objective: (planArr[1]?.objective || 'Đóng gói SOP đào tạo nhân viên, đưa trợ lý AI vào hỗ trợ tư vấn và xây dựng phễu combo sản phẩm.').trim(),
      kpi: (planArr[1]?.kpi || 'Giảm 30% thời gian xử lý đơn, tăng 25% giá trị đơn trung bình').trim(),
      timeline: (planArr[1]?.timeline || 'Ngày 31 - 60').trim(),
    },
    {
      phase: 'GIAI ĐOẠN 3 (NGÀY 61 - 90): TĂNG TỐC & MỞ RỘNG QUY MÔ',
      title: (planArr[2]?.title || 'Mở rộng kênh tiếp cận và nhân bản mô hình kinh doanh').trim(),
      objective: (planArr[2]?.objective || 'Thiết lập quan hệ đối tác chiến lược, nhân bản cơ sở mới hoặc triển khai gói hội viên dài hạn.').trim(),
      kpi: (planArr[2]?.kpi || 'Đạt mục tiêu tăng trưởng doanh số quý, bộ máy tự vận hành trơn tru').trim(),
      timeline: (planArr[2]?.timeline || 'Ngày 61 - 90').trim(),
    },
  ];

  phases.forEach((pItem) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, 25, 'FD');

    doc.setFillColor(219, 234, 254);
    doc.rect(margin + 4, currentY + 3.5, 58, 4, 'F');
    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(29, 78, 216);
    doc.text(pItem.phase, margin + 6, currentY + 6.3);

    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Thời gian: ${pItem.timeline}`, margin + contentWidth - 35, currentY + 6.3);

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(pItem.title, margin + 4, currentY + 12);

    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(71, 85, 105);
    const splitObj = doc.splitTextToSize(`• Mục tiêu: ${pItem.objective}`, contentWidth - 8);
    doc.text(splitObj, margin + 4, currentY + 16.5);

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(21, 128, 61);
    doc.text(`• Đo lường KPI: ${pItem.kpi}`, margin + 4, currentY + 22.5);

    currentY += 28;
  });

  // 5. ĐÁNH GIÁ ĐIỂM NGHẼN RÒ RỈ DÒNG TIỀN (REVENUE LEAKS AUDIT)
  currentY += 2;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('DejaVuSans', 'bold');
  doc.text('5. DANH MỤC ĐIỂM NGHẼN & RÒ RỈ DÒNG TIỀN ƯU TIÊN XỬ LÝ', margin, currentY);

  currentY += 4;
  const bList = Array.isArray(data.topBottlenecks) && data.topBottlenecks.length > 0
    ? data.topBottlenecks.slice(0, 3)
    : [
        {
          title: 'Rò rỉ dữ liệu khách hàng & thiếu cơ chế kích hoạt mua lại',
          zone: 'Khách hàng',
          recommendation: 'Triển khai ngay hệ thống CRM cơ bản và tự động gửi tin nhắn chăm sóc sau bán.',
        },
        {
          title: 'Hiện diện số còn mờ nhạt, phụ thuộc truyền miệng trực tiếp',
          zone: 'Tiếp cận',
          recommendation: 'Xây dựng trang đích và đường dẫn mua hàng rõ ràng qua Zalo/Website.',
        },
        {
          title: 'Quy trình vận hành phụ thuộc năng lực cá nhân của CEO',
          zone: 'Vận hành',
          recommendation: 'Chuẩn hóa quy trình bàn giao SOP và phân cấp kiểm soát cho trưởng nhóm.',
        },
      ];

  bList.forEach((b: any, bIdx: number) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, 16, 'FD');

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(190, 18, 60);
    doc.text(`⚠️ NGHẼN 0${bIdx + 1} [Vùng ${b.zone || 'Vận hành'}]: ${(b.title || '').trim()}`, margin + 4, currentY + 5);

    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    const splitRec = doc.splitTextToSize(`Khuyến nghị giải pháp: ${(b.recommendation || '').trim()}`, contentWidth - 8);
    doc.text(splitRec, margin + 4, currentY + 10.5);

    currentY += 18.5;
  });

  // 6. CHỨNG NHẬN KIỂM ĐỊNH & BẢO MẬT
  currentY += 2;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 17, 'FD');

  doc.setFont('DejaVuSans', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('🔒 CHỨNG NHẬN KIỂM ĐỊNH TÍNH LOGIC DÒNG TIỀN & BẢO MẬT DOANH NGHIỆP', margin + 4, currentY + 5.5);

  doc.setFont('DejaVuSans', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Bản phân tích được đối soát tự động theo thuật toán chẩn đoán 10 trục năng lực cạnh tranh và 5 vùng rò rỉ dòng tiền của SME Việt Nam.',
    margin + 4,
    currentY + 10
  );
  doc.text(
    'Toàn bộ số liệu và thông tin trong tài liệu này thuộc quyền sở hữu bảo mật của doanh nghiệp và chỉ dùng cho mục đích điều hành nội bộ.',
    margin + 4,
    currentY + 14
  );

  // Footer Trang 2
  doc.setFont('DejaVuSans', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Trang 2/2 • Báo cáo chiến lược độc quyền dành cho CEO • AI Business Health Check Engine 2026 • Bảo mật tuyệt đối.',
    pageWidth / 2,
    287,
    { align: 'center' }
  );

  return Buffer.from(doc.output('arraybuffer'));
}
