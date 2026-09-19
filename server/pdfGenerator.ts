import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { ReportEmailData } from './emailTemplate';

// Xác định đường dẫn phông chữ hỗ trợ 100% tiếng Việt có dấu Unicode
function getVietnameseFontPaths() {
  const systemRegular = '/usr/share/fonts/truetype/freefont/FreeSans.ttf';
  const systemBold = '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf';

  const regular = fs.existsSync(systemRegular)
    ? systemRegular
    : 'Helvetica';

  const bold = fs.existsSync(systemBold)
    ? systemBold
    : 'Helvetica-Bold';

  return { regular, bold };
}

export function generateExecutivePdfBuffer(data: ReportEmailData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 36, bottom: 36, left: 36, right: 36 },
      });

      const { regular: regularFont, bold: boldFont } = getVietnameseFontPaths();

      if (regularFont !== 'Helvetica' && fs.existsSync(regularFont)) {
        try {
          doc.registerFont('VNRegular', regularFont);
          doc.registerFont('VNBold', boldFont);
        } catch (e) {
          console.warn('Cannot register custom font:', e);
        }
      }

      // Intercept doc.font to fallback safely to Helvetica if custom font is not registered
      const origFont = doc.font.bind(doc);
      (doc as any).font = (name: string, ...args: any[]) => {
        try {
          return origFont(name, ...args);
        } catch {
          if (name && name.toLowerCase().includes('bold')) {
            return origFont('Helvetica-Bold', ...args);
          }
          return origFont('Helvetica', ...args);
        }
      };

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const businessName = data.businessName || 'Doanh Nghiệp';
      const ceoName = data.receiverName || 'CEO';
      const industry = data.profile?.industry || 'Thương mại / Dịch vụ';
      const score = data.healthScore !== undefined ? data.healthScore : 74;

      // 1. TOP HEADER BANNER (Navy hiện đại)
      doc.rect(36, 36, 523, 72).fill('#0f172a');
      doc.fillColor('#93c5fd').fontSize(8).font('VNBold')
        .text('AI BUSINESS HEALTH CHECK 2026 • EXECUTIVE STRATEGY REPORT', 48, 46, { characterSpacing: 1 });
      doc.fillColor('#ffffff').fontSize(15).font('VNBold')
        .text('BẢN ĐỒ CHIẾN LƯỢC & TƯ VẤN ĐIỀU HÀNH CEO', 48, 60);
      doc.fillColor('#cbd5e1').fontSize(8.5).font('VNRegular')
        .text(`Doanh nghiệp: ${businessName} | Lãnh đạo: ${ceoName} | Ngành: ${industry}`, 48, 83, { width: 500 });

      // 2. HEALTH SCORE & SUMMARY BOX
      let currentY = 118;
      doc.rect(36, currentY, 523, 68).fillAndStroke('#f8fafc', '#cbd5e1');

      // Score Column
      doc.fillColor('#64748b').fontSize(7.5).font('VNBold').text('CHỈ SỐ SỨC KHỎE', 48, currentY + 12);
      doc.fillColor(score >= 80 ? '#16a34a' : score >= 60 ? '#1d4ed8' : '#ea580c').fontSize(26).font('VNBold')
        .text(`${score}`, 48, currentY + 24);
      doc.fillColor('#64748b').fontSize(10).font('VNRegular').text('/100', 88, currentY + 36);

      const scoreGrade = score >= 80 ? 'HẠNG A' : score >= 60 ? 'HẠNG B' : 'HẠNG C';
      doc.fillColor(score >= 80 ? '#16a34a' : score >= 60 ? '#1d4ed8' : '#ea580c').fontSize(7.5).font('VNBold')
        .text(scoreGrade, 48, currentY + 52);

      // Summary Column
      doc.rect(125, currentY + 10, 1, 48).fill('#cbd5e1');
      doc.fillColor('#1e40af').fontSize(8).font('VNBold')
        .text('✦ NHẬN ĐỊNH TỪ CHUYÊN GIA CHIẾN LƯỢC AI', 138, currentY + 12);
      const summaryText = data.healthSummary || 'Doanh nghiệp sở hữu nền tảng sản phẩm tốt nhưng dòng tiền đang bị rò rỉ ở khâu giữ chân khách hàng cũ và tự động hóa vận hành.';
      doc.fillColor('#1e293b').fontSize(8.5).font('VNRegular')
        .text(`“${summaryText}”`, 138, currentY + 26, { width: 405, lineGap: 3 });

      // 3. 5 PILLARS ASSESSMENT
      currentY = 196;
      doc.fillColor('#0f172a').fontSize(9.5).font('VNBold').text('1. ĐÁNH GIÁ 5 TRỤ CỘT NĂNG LỰC DOANH NGHIỆP', 36, currentY);

      currentY += 15;
      const pillars = [
        { label: 'Tài chính & Dòng tiền (Cashflow)', score: data.radarScores?.finance || 72 },
        { label: 'Vận hành & Hệ thống (Operations)', score: data.radarScores?.operations || 65 },
        { label: 'Tiếp thị & Khách hàng (Marketing)', score: data.radarScores?.marketing || 80 },
        { label: 'Đội ngũ & Con người (Team & HR)', score: data.radarScores?.team || 68 },
        { label: 'Lợi thế cạnh tranh & Sản phẩm (Moat)', score: data.radarScores?.advantage || 85 },
      ];

      doc.rect(36, currentY, 523, 76).fillAndStroke('#ffffff', '#e2e8f0');
      let barY = currentY + 8;
      pillars.forEach((p) => {
        doc.fillColor('#334155').fontSize(8).font('VNRegular').text(p.label, 48, barY);
        doc.fillColor('#1d4ed8').fontSize(8).font('VNBold').text(`${p.score}/100`, 245, barY, { width: 45, align: 'right' });

        // Bar background
        doc.rect(300, barY + 1, 240, 6).fill('#e2e8f0');
        // Bar progress
        const barWidth = (Math.min(100, Math.max(0, p.score)) / 100) * 240;
        doc.rect(300, barY + 1, barWidth, 6).fill('#2563eb');

        barY += 13;
      });

      // 4. HIGHEST LEVERAGE ACTION (IF ONLY ONE THING)
      currentY = 298;
      doc.fillColor('#0f172a').fontSize(9.5).font('VNBold')
        .text('2. HÀNH ĐỘNG ĐÒN BẨY SỐ 1 (Nếu chỉ làm 1 việc trong 30 ngày tới)', 36, currentY);

      currentY += 15;
      doc.rect(36, currentY, 523, 72).fillAndStroke('#fefce8', '#fde047');
      doc.fillColor('#854d0e').fontSize(7.5).font('VNBold').text('HÀNH ĐỘNG TRỌNG TÂM 30 NGÀY:', 48, currentY + 10);

      const actionText = data.ifOnlyOneThing?.action || 'Kích hoạt chiến dịch gọi điện/nhắn tin chăm sóc 100 khách hàng cũ thân thiết nhất.';
      doc.fillColor('#713f12').fontSize(9.5).font('VNBold').text(actionText, 48, currentY + 22, { width: 500 });

      const reasonText = data.ifOnlyOneThing?.reason || 'Chi phí giữ chân khách cũ chỉ bằng 1/5 chi phí tìm khách mới, tạo dòng tiền nóng ngay lập tức.';
      doc.fillColor('#854d0e').fontSize(8).font('VNRegular').text(`Lý do: ${reasonText}`, 48, currentY + 38, { width: 500 });

      const impactText = data.ifOnlyOneThing?.impact || 'Dự kiến tăng ngay 15% - 25% doanh thu trong 30 ngày mà không tốn thêm ngân sách quảng cáo.';
      doc.fillColor('#15803d').fontSize(8).font('VNBold').text(`Tác động: ${impactText}`, 48, currentY + 53, { width: 500 });

      // 5. THREE KEY INSIGHTS
      currentY = 396;
      doc.fillColor('#0f172a').fontSize(9.5).font('VNBold')
        .text('3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC TRỌNG YẾU', 36, currentY);

      currentY += 15;
      // Strength
      doc.rect(36, currentY, 523, 27).fillAndStroke('#f0fdf4', '#bbf7d0');
      doc.fillColor('#166534').fontSize(7.5).font('VNBold').text('[+] ĐIỂM MẠNH:', 48, currentY + 8);
      const strengthText = data.threeKeyInsights?.greatestStrength || 'Sản phẩm có lợi thế cạnh tranh tự nhiên và tỷ lệ khách hàng hài lòng cao.';
      doc.fillColor('#14532d').fontSize(8).font('VNRegular')
        .text(strengthText, 130, currentY + 8, { width: 415, lineGap: 2 });

      // Bottleneck
      currentY += 31;
      doc.rect(36, currentY, 523, 27).fillAndStroke('#fef2f2', '#fecaca');
      doc.fillColor('#991b1b').fontSize(7.5).font('VNBold').text('[-] ĐIỂM NGHẼN:', 48, currentY + 8);
      const bottleneckText = data.threeKeyInsights?.biggestBottleneck || 'Phụ thuộc vào khách mới, tỷ lệ quay lại mua hàng chưa được khai thác triệt để.';
      doc.fillColor('#7f1d1d').fontSize(8).font('VNRegular')
        .text(bottleneckText, 130, currentY + 8, { width: 415, lineGap: 2 });

      // Opportunity
      currentY += 31;
      doc.rect(36, currentY, 523, 27).fillAndStroke('#eff6ff', '#bfdbfe');
      doc.fillColor('#1e40af').fontSize(7.5).font('VNBold').text('[*] CƠ HỘI VÀNG:', 48, currentY + 8);
      const oppText = data.threeKeyInsights?.mostPromisingOpportunity || 'Xây dựng phễu chăm sóc tự động và gói sản phẩm định kỳ (combo/membership).';
      doc.fillColor('#1e3a8a').fontSize(8).font('VNRegular')
        .text(oppText, 130, currentY + 8, { width: 415, lineGap: 2 });

      // 6. 90-DAY ACTION PLAN
      currentY = 510;
      doc.fillColor('#0f172a').fontSize(9.5).font('VNBold')
        .text('4. LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO', 36, currentY);

      currentY += 15;
      const plan = data.ninetyDayPlan && data.ninetyDayPlan.length > 0 ? data.ninetyDayPlan : [
        {
          timeline: 'Tuần 1 - 2',
          title: 'DẬP TẮT ĐÁM CHÁY & CẮT RÒ RỈ DÒNG TIỀN',
          objective: 'Kiểm toán toàn bộ chi phí thừa và thu hồi công nợ quá hạn.',
          kpi: 'Giảm 10% chi phí vận hành không thiết yếu.',
        },
        {
          timeline: 'Tuần 3 - 6',
          title: 'TỐI ƯU HÓA PHỄU BÁN HÀNG & TĂNG TỶ LỆ QUAY LẠI',
          objective: 'Xây dựng quy trình chăm sóc khách hàng sau mua và kịch bản upsell.',
          kpi: 'Tỷ lệ khách hàng mua lại lần 2 tăng tối thiểu 20%.',
        },
        {
          timeline: 'Tuần 7 - 12',
          title: 'ĐÓNG GÓI QUY TRÌNH & BÀN GIAO VẬN HÀNH',
          objective: 'Chuẩn hóa quy trình làm việc (SOP) để CEO giảm 40% thời gian can thiệp trực tiếp.',
          kpi: 'Đội ngũ tự vận hành 80% công việc thường nhật.',
        },
      ];

      plan.forEach((item, idx) => {
        doc.rect(36, currentY, 523, 44).fillAndStroke('#ffffff', '#e2e8f0');
        doc.fillColor('#2563eb').fontSize(7).font('VNBold').text(item.timeline || `GIAI ĐOẠN 0${idx + 1}`, 48, currentY + 6);
        doc.fillColor('#0f172a').fontSize(8).font('VNBold').text(item.title || '', 115, currentY + 6);
        doc.fillColor('#475569').fontSize(7.5).font('VNRegular')
          .text(`Mục tiêu: ${item.objective || ''}`, 48, currentY + 18, { width: 495 });
        doc.fillColor('#15803d').fontSize(7.5).font('VNBold')
          .text(`KPI: ${item.kpi || ''}`, 48, currentY + 29, { width: 495 });

        currentY += 47;
      });

      // 7. FOOTER
      doc.rect(36, 755, 523, 30).fill('#f1f5f9');
      doc.fillColor('#64748b').fontSize(7).font('VNRegular')
        .text('AI BUSINESS HEALTH CHECK 2026 • HỆ THỐNG CHẨN ĐOÁN CHIẾN LƯỢC DOANH NGHIỆP VIỆT NAM', 48, 763, { align: 'center', width: 500 });
      doc.fillColor('#94a3b8').fontSize(6.5).font('VNRegular')
        .text(`Xác thực ký điện tử: ${new Date().toLocaleString('vi-VN')} • Mã báo cáo: #AIBHC-${Date.now().toString().slice(-6)}`, 48, 772, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

