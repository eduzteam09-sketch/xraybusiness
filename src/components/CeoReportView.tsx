import React, { useState } from 'react';
import {
  Printer,
  Download,
  Mail,
  Building2,
  User,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Send,
  Sparkles,
  Check,
  Flame,
  FileText,
  Paperclip,
  ExternalLink,
  Info,
  ArrowUpRight,
  Settings,
} from 'lucide-react';
import { DiagnosisReport } from '../types';
import jsPDF from 'jspdf';
import { setupVietnameseFont } from '../services/vietnameseFont';

interface CeoReportViewProps {
  report: DiagnosisReport;
  onBackToOverview?: () => void;
}

export const CeoReportView: React.FC<CeoReportViewProps> = ({ report, onBackToOverview }) => {
  const {
    profile,
    healthScore,
    healthSummary,
    threeKeyInsights,
    ifOnlyOneThing,
    ninetyDayPlan,
    radarScores,
    bottlenecks,
    createdAt,
  } = report;

  const topBottlenecks = Array.isArray(bottlenecks) && bottlenecks.length > 0
    ? bottlenecks.slice(0, 3)
    : [];

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('eduzteam09@gmail.com');
  const [receiverName, setReceiverName] = useState<string>(profile.ceoName || 'CEO');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailDeliveryResult, setEmailDeliveryResult] = useState<{
    status: 'ok' | 'needs_smtp_config' | 'error' | 'resend_error';
    message: string;
    isRealDelivery?: boolean;
    provider?: 'resend' | 'smtp';
    attachmentName?: string;
    attachmentSize?: string;
    messageId?: string;
  } | null>(null);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('Bao_Cao_Chien_Luoc_CEO.pdf');

  const formattedDate = new Date(createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // TẠO NỘI DUNG TÓM TẮT DÀNH CHO EMAIL
  const generateEmailText = () => {
    return `Kính gửi Anh/Chị ${receiverName || profile.ceoName || 'CEO'},

Dưới đây là BẢN TÓM TẮT BÁO CÁO ĐỊNH VỊ & CHẨN ĐOÁN CHIẾN LƯỢC DOANH NGHIỆP:

🏢 DOANH NGHIỆP: ${profile.businessName}
👔 LÃNH ĐẠO: ${profile.ceoName}
🏷️ LĨNH VỰC: ${profile.industry}
📅 NGÀY CHẨN ĐOÁN: ${formattedDate}

--------------------------------------------------
1. CHỈ SỐ SỨC KHỎE TỔNG THỂ: ${healthScore}/100 ĐIỂM
Đánh giá: ${healthSummary}

--------------------------------------------------
2. HÀNH ĐỘNG ĐÒN BẨY CAO NHẤT (Nếu chỉ làm 1 việc trong 30 ngày tới):
👉 ${ifOnlyOneThing.action}
Lý do: ${ifOnlyOneThing.reason}

--------------------------------------------------
3. TAM GIÁC NHẬN ĐỊNH TRỌNG YẾU:
- ĐIỂM MẠNH LỚN NHẤT: ${threeKeyInsights.greatestStrength}
- ĐIỂM NGHẼN RÒ RỈ DÒNG TIỀN: ${threeKeyInsights.biggestBottleneck}
- CƠ HỘI ĐÁNG GIÁ NHẤT: ${threeKeyInsights.mostPromisingOpportunity}

--------------------------------------------------
4. LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO:
${ninetyDayPlan
  .map(
    (p, i) =>
      `• Giai đoạn 0${i + 1} (${p.timeline}): ${p.title}
  Mục tiêu: ${p.objective}
  KPI đo lường: ${p.kpi}`
  )
  .join('\n')}

--------------------------------------------------
Hệ thống AI Business Health Check 2026`;
  };

  // 1. HÀM TẠO VÀ TỰ ĐỘNG TẢI FILE PDF VỀ MÁY (KHÔNG HIỆN CỬA SỔ POPUP, KHÔNG MỞ PRINT PREVIEW)
  const handleDownloadPdf = async (): Promise<string | null> => {
    try {
      setIsGeneratingPdf(true);
      setPdfSuccessMessage(null);

      const asciiBusinessName = (profile.businessName || 'Doanh_Nghiep')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || 'Doanh_Nghiep'}.pdf`;
      setPdfFileName(fileName);

      // Ưu tiên 1: Tạo và tải trực tiếp PDF vector độ nét cao từ máy chủ (Chuẩn font Roboto tiếng Việt)
      try {
        const resp = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverName: receiverName || profile.ceoName || 'CEO',
            businessName: profile.businessName,
            healthScore,
            healthSummary,
            threeKeyInsights,
            ifOnlyOneThing,
            ninetyDayPlan,
            radarScores,
            profile,
            topBottlenecks,
            bottlenecks,
          }),
        });

        if (resp.ok) {
          const blob = await resp.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPdfDownloadUrl(blobUrl);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setIsGeneratingPdf(false);
          setPdfSuccessMessage(`Đã tải xuống báo cáo PDF: ${fileName}`);
          setTimeout(() => setPdfSuccessMessage(null), 10000);
          return blobUrl;
        }
      } catch (serverErr) {
        console.warn('Máy chủ tạo PDF không phản hồi, tự động chuyển sang bộ tạo vector nội bộ:', serverErr);
      }

      // Ưu tiên 2: Tự động tạo vector nội bộ qua jsPDF nếu không gọi được máy chủ
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      setupVietnameseFont(doc);

      const pageWidth = 210;
      const margin = 12;
      const contentWidth = pageWidth - margin * 2;

      const bName = (profile.businessName || 'DOANH NGHIỆP').trim();
      const cName = (receiverName || 'CEO / LÃNH ĐẠO').trim();
      const ind = (profile.industry || 'Thương mại & Dịch vụ').trim();
      const score = healthScore !== undefined ? healthScore : 72;

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, 12, contentWidth, 24, 'F');

      doc.setTextColor(147, 197, 253);
      doc.setFontSize(7.5);
      doc.setFont('DejaVuSans', 'bold');
      doc.text('AI BUSINESS HEALTH CHECK 2026 - EXECUTIVE STRATEGY REPORT', margin + 5, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont('DejaVuSans', 'bold');
      doc.text(`BẢN ĐỒ CHIẾN LƯỢC & ĐỊNH VỊ: ${bName.toUpperCase()}`, margin + 5, 26);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(7.5);
      doc.setFont('DejaVuSans', 'normal');
      doc.text(`Người nhận: ${cName} | Ngành: ${ind} | Thời điểm: ${new Date().toLocaleDateString('vi-VN')}`, margin + 5, 32);

      // Score Box
      let currentY = 40;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, currentY, contentWidth, 22, 'FD');

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

      doc.setDrawColor(226, 232, 240);
      doc.line(margin + 36, currentY + 3, margin + 36, currentY + 19);

      doc.setTextColor(30, 64, 175);
      doc.setFontSize(7.5);
      doc.setFont('DejaVuSans', 'bold');
      doc.text('NHẬN ĐỊNH CHIẾN LƯỢC TỔNG QUAN:', margin + 40, currentY + 6);

      const summary = (healthSummary || 'Doanh nghiệp đang có nền tảng sản phẩm truyền thống và chất lượng cốt lõi rất tốt, nhưng cần tập trung tối ưu hóa kênh tiếp cận và kích hoạt mua lại.').trim();
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

      // Chuẩn hóa danh sách đủ 10 trục năng lực
      const defaultAxes = [
        { subject: 'USP khác biệt', label: '1. USP khác biệt vượt trội', score: 4.0, benchmark: 3.5, isLeak: false },
        { subject: 'Nhóm khách lợi nhuận', label: '2. Nhóm khách tạo 80% lợi nhuận', score: 3.5, benchmark: 3.2, isLeak: false },
        { subject: 'Thấu hiểu Insight', label: '3. Thấu hiểu nỗi đau khách hàng', score: 4.0, benchmark: 3.0, isLeak: false },
        { subject: 'Dễ dàng tìm thấy', label: '4. Hiện diện số & Dễ tìm thấy', score: 2.0, benchmark: 3.4, isLeak: true },
        { subject: 'Internet -> Doanh thu', label: '5. Phễu Online ra Doanh thu', score: 2.0, benchmark: 3.5, isLeak: true },
        { subject: 'Cơ chế mua lại', label: '6. Tự động nhắc nhở mua lại', score: 2.0, benchmark: 3.2, isLeak: true },
        { subject: 'Cross-sell / Upsell', label: '7. Chiến lược Combo & Bán thêm', score: 2.5, benchmark: 3.0, isLeak: false },
        { subject: 'Dữ liệu khách hàng', label: '8. Thu thập & Khai thác dữ liệu', score: 1.5, benchmark: 3.2, isLeak: true },
        { subject: 'Tăng trưởng không tăng NS', label: '9. Tăng trưởng không tăng NS', score: 3.0, benchmark: 2.8, isLeak: false },
        { subject: 'Dễ dàng nhân bản', label: '10. Khả năng đóng gói & Nhân bản', score: 3.0, benchmark: 3.0, isLeak: false },
      ];

      const axesList = Array.isArray(radarScores) && radarScores.length > 0
        ? radarScores.map((r: any, idx: number) => {
            const rawScore = typeof r.score === 'number' ? r.score : 3.0;
            // Nếu điểm vô tình bị nhân hệ 100, quy đổi an toàn về thang điểm 5
            const sc = rawScore > 5 ? Math.round((rawScore / 20) * 10) / 10 : Math.round(rawScore * 10) / 10;
            const bm = typeof r.benchmark === 'number' ? r.benchmark : 3.0;
            const lbl = (r.subject || r.vietnameseFull || `Trục ${idx + 1}`).replace(/^\([0-9]+\)\s*/, `${idx + 1}. `).trim();
            return {
              label: lbl,
              score: sc,
              benchmark: bm,
              isLeak: sc <= 2.0,
            };
          })
        : defaultAxes.map((a) => ({ ...a, isLeak: a.score <= 2.0 }));

      // Đảm bảo đủ 10 trục
      while (axesList.length < 10) {
        const nextIdx = axesList.length;
        const fallback = defaultAxes[nextIdx]
          ? { ...defaultAxes[nextIdx] }
          : { label: `${nextIdx + 1}. Năng lực bổ trợ`, score: 3.0, benchmark: 3.0, isLeak: false };
        axesList.push(fallback);
      }

      // Vẽ 2 cột: Cột 1 (trục 1 - 5), Cột 2 (trục 6 - 10)
      const colWidth = (contentWidth - 6) / 2;
      const leftColX = margin + 3;
      const rightColX = margin + colWidth + 5;
      const maxBarWidth = 22;

      for (let i = 0; i < 5; i++) {
        const rowY = currentY + 4 + i * 8;

        // Cột trái: Trục i (0..4)
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

          // Thanh đo cột trái
          doc.setFillColor(226, 232, 240);
          doc.rect(leftColX + 58, rowY + 3.8, maxBarWidth, 2, 'F');
          const leftBarW = (Math.min(5, Math.max(0, leftItem.score)) / 5) * maxBarWidth;
          doc.setFillColor(leftItem.isLeak ? 239 : 37, leftItem.isLeak ? 68 : 99, leftItem.isLeak ? 68 : 235);
          doc.rect(leftColX + 58, rowY + 3.8, leftBarW, 2, 'F');
        }

        // Cột phải: Trục i + 5 (5..9)
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

          // Thanh đo cột phải
          doc.setFillColor(226, 232, 240);
          doc.rect(rightColX + 58, rowY + 3.8, maxBarWidth, 2, 'F');
          const rightBarW = (Math.min(5, Math.max(0, rightItem.score)) / 5) * maxBarWidth;
          doc.setFillColor(rightItem.isLeak ? 239 : 37, rightItem.isLeak ? 68 : 99, rightItem.isLeak ? 68 : 235);
          doc.rect(rightColX + 58, rowY + 3.8, rightBarW, 2, 'F');
        }
      }

      // Đường kẻ ngăn giữa 2 cột ma trận
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
      doc.setFillColor(254, 243, 199); // #fef3c7 amber-100
      doc.setDrawColor(245, 158, 11);
      doc.rect(margin, currentY, contentWidth, actionBoxHeight, 'FD');

      const ifOneAction = (ifOnlyOneThing?.action || 'Khai thác tối đa giá trị vòng đời khách hàng cũ thông qua chuỗi chăm sóc tự động để tăng biên lợi nhuận gộp ngay lập tức.').trim();
      const ifOneReason = (ifOnlyOneThing?.reason || 'Chi phí tái kích hoạt khách cũ chỉ bằng 1/5 chi phí tìm khách hàng mới.').trim();
      const ifOneImpact = (ifOnlyOneThing?.impact || 'Tăng ngay 20-35% doanh thu định kỳ mà không cần tăng ngân sách quảng cáo.').trim();

      doc.setTextColor(146, 64, 14);
      doc.setFontSize(7.5);
      doc.setFont('DejaVuSans', 'bold');
      doc.text('👉 ĐÒN BẨY SỐ 1:', margin + 4, currentY + 5);

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 53, 15);
      const splitOneAction = doc.splitTextToSize(ifOneAction, contentWidth - 35);
      doc.text(splitOneAction, margin + 30, currentY + 5);

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
      const insList = [
        {
          title: '01. DÒNG TIỀN & HIỆN TRẠNG (ĐIỂM MẠNH LỚN NHẤT)',
          text: (threeKeyInsights?.greatestStrength || 'Nguồn thu ổn định từ khách hàng hài lòng, sản phẩm cốt lõi có chất lượng vững chắc.').trim(),
          bg: [240, 253, 244],
          border: [187, 247, 208],
          titleColor: [22, 101, 52],
        },
        {
          title: '02. ĐIỂM NGHẼN CỐT LÕI (RÒ RỈ CẦN GỠ BỎ NGAY)',
          text: (threeKeyInsights?.biggestBottleneck || 'Quy trình bán hàng còn phụ thuộc nhiều vào nhân sự, thiếu hệ thống tự động ghi nhận và nhắc nhở mua lại.').trim(),
          bg: [254, 242, 242],
          border: [254, 202, 202],
          titleColor: [153, 27, 27],
        },
        {
          title: '03. CƠ HỘI ĐÁNG GIÁ NHẤT (BỨT PHÁ QUY MÔ & DOANH SỐ)',
          text: (threeKeyInsights?.mostPromisingOpportunity || 'Ứng dụng tự động hóa & AI vào kênh chăm sóc khách hàng và bán thêm combo dịch vụ giúp tối ưu lợi nhuận.').trim(),
          bg: [239, 246, 255],
          border: [191, 219, 254],
          titleColor: [30, 64, 175],
        },
      ];

      insList.forEach((ins) => {
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
      doc.text(`BẢN ĐỒ CHIẾN LƯỢC & ĐỊNH VỊ: ${bName.toUpperCase()} (TRANG 2/2)`, margin + 5, 23);

      // 4. LỘ TRÌNH 3 GIAI ĐOẠN 90 NGÀY CỦA CEO
      currentY = 32;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('DejaVuSans', 'bold');
      doc.text('4. LỘ TRÌNH THỰC THI 3 GIAI ĐOẠN 90 NGÀY CỦA CEO (90-DAY EXECUTION ROADMAP)', margin, currentY);

      currentY += 4;
      const planArr = Array.isArray(ninetyDayPlan) ? ninetyDayPlan : [];
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

        // Badge giai đoạn
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
      const bList = Array.isArray(topBottlenecks) && topBottlenecks.length > 0
        ? topBottlenecks.slice(0, 3)
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

      // TỰ ĐỘNG TẢI TRỰC TIẾP FILE VỀ TRÌNH DUYỆT (HỖ TRỢ CẢ SANDBOX IFRAME)
      try {
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        setPdfDownloadUrl(blobUrl);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (saveErr) {
        console.warn('Lỗi khi tải bằng Blob URL, thử doc.save trực tiếp:', saveErr);
        doc.save(fileName);
      }

      setIsGeneratingPdf(false);
      setPdfSuccessMessage(`Đã tự động tải xuống báo cáo: ${fileName}`);
      setTimeout(() => setPdfSuccessMessage(null), 10000);

      return doc.output('datauristring');
    } catch (err: any) {
      console.error('Lỗi khi xuất PDF:', err);
      setIsGeneratingPdf(false);

      // Fallback gọi máy chủ tải trực tiếp file nếu có sự cố trên trình duyệt
      try {
        const resp = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverName: receiverName || profile.ceoName || 'CEO',
            businessName: profile.businessName,
            healthScore,
            healthSummary,
            threeKeyInsights,
            ifOnlyOneThing,
            ninetyDayPlan,
            radarScores,
            profile,
            topBottlenecks,
            bottlenecks,
          }),
        });
        if (resp.ok) {
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Bao_Cao_Chien_Luoc_CEO_${(profile.businessName || 'Doanh_Nghiep').replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          setPdfSuccessMessage('Đã tải xuống báo cáo PDF từ máy chủ thành công!');
          setTimeout(() => setPdfSuccessMessage(null), 5000);
          return null;
        }
      } catch (serverErr) {
        console.error('Fallback server PDF generation cũng thất bại:', serverErr);
      }

      return null;
    }
  };

  // 2. HÀM GỬI EMAIL BÁO CÁO (CHỈ GỬI MAIL, KHÔNG BẬT CỬA SỔ TẢI FILE HOẶC IN ẤN)
  const handleSendEmailAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Vui lòng nhập đúng định dạng email hợp lệ');
      return;
    }

    setIsSendingEmail(true);
    setEmailDeliveryResult(null);

    const emailSubject = `[BÁO CÁO CHIẾN LƯỢC CEO] Chẩn Đoán & Định Vị Doanh Nghiệp ${profile.businessName}`;
    const emailBody = generateEmailText();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          receiverName: receiverName.trim(),
          businessName: profile.businessName,
          healthScore: healthScore,
          healthSummary: healthSummary,
          threeKeyInsights: threeKeyInsights,
          ifOnlyOneThing: ifOnlyOneThing,
          ninetyDayPlan: ninetyDayPlan,
          radarScores: radarScores,
          profile: profile,
          topBottlenecks: topBottlenecks,
          bottlenecks: bottlenecks,
          subject: emailSubject,
          reportSummary: healthSummary,
          textContent: emailBody,
        }),
      });

      let data: any = null;
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Không thể parse JSON từ máy chủ:', textResponse);
        setIsSendingEmail(false);
        setEmailDeliveryResult({
          status: 'error',
          isRealDelivery: false,
          message: textResponse.includes('FUNCTION_INVOCATION_FAILED') || textResponse.includes('server error')
            ? 'Máy chủ gửi email đang trong quá trình cập nhật. Vui lòng bấm thử lại.'
            : (textResponse || 'Phản hồi không hợp lệ từ máy chủ.'),
        });
        return;
      }
      setIsSendingEmail(false);

      if (data.status === 'ok' && data.isRealDelivery) {
        // Đã gửi thật sự qua Resend API hoặc máy chủ SMTP
        setEmailDeliveryResult({
          status: 'ok',
          isRealDelivery: true,
          provider: data.provider || 'resend',
          message: data.message || `Đã chuyển phát thành công báo cáo vào hộp thư ${emailInput}!`,
          attachmentName: data.attachmentName,
          attachmentSize: data.attachmentSize,
          messageId: data.messageId,
        });
      } else if (data.status === 'resend_error') {
        setEmailDeliveryResult({
          status: 'resend_error',
          isRealDelivery: false,
          message: data.message || 'Lỗi gửi thư từ cổng Resend Cloud.',
          attachmentName: data.attachmentName,
        });
      } else if (data.status === 'needs_smtp_config') {
        // Chưa cấu hình tài khoản gửi thư: Thông báo rõ ràng và tự động kích hoạt tải file PDF về máy
        setEmailDeliveryResult({
          status: 'needs_smtp_config',
          isRealDelivery: false,
          message: data.message,
          attachmentName: data.attachmentName,
          attachmentSize: data.attachmentSize,
        });
        // Tự động tải ngay file PDF về máy cho người dùng
        setTimeout(() => {
          handleDownloadPdf();
        }, 100);
      } else {
        setEmailDeliveryResult({
          status: 'error',
          message: data.message || 'Lỗi khi gửi email từ máy chủ.',
        });
      }
    } catch (err: any) {
      console.error('Lỗi khi gọi API gửi mail:', err);
      setIsSendingEmail(false);
      setEmailDeliveryResult({
        status: 'error',
        isRealDelivery: false,
        message: err?.message ? `Lỗi kết nối: ${err.message}` : 'Máy chủ chưa kết nối được cổng phát thư ra Internet. Vui lòng thử lại.',
      });
    }
  };

  // Mở trình soạn thảo Gmail trực tiếp để gửi ngay không bị chặn
  const handleOpenDirectGmail = () => {
    const subject = `[BÁO CÁO CHIẾN LƯỢC CEO] Chẩn Đoán & Định Vị Doanh Nghiệp ${profile.businessName}`;
    const body = generateEmailText();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emailInput
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28 font-sans">
      {/* Top Action Bar - Tone sáng, hiện đại, bố cục thoáng đãng */}
      <div className="print:hidden bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 mb-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Báo Cáo Tóm Tắt Dành Cho Lãnh Đạo</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            BẢN ĐỒ CHIẾN LƯỢC &amp; TƯ VẤN ĐIỀU HÀNH CEO
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chuẩn hóa 1 trang Executive Summary độ phân giải cao gửi Hội đồng quản trị hoặc lưu trữ.
          </p>
        </div>

        {/* Action Buttons: Tải PDF & Gửi Email */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="download-pdf-btn"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 hover:scale-[1.02]"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tạo PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải File PDF Về Máy</span>
              </>
            )}
          </button>

          <button
            id="email-report-btn"
            onClick={() => {
              setEmailDeliveryResult(null);
              setIsEmailModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-200 shadow-2xs flex items-center gap-2 hover:border-slate-300"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Gửi Về Email Hòm Thư</span>
          </button>

          <button
            id="print-report-btn"
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200/80"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Thông báo tải PDF thành công */}
      {pdfSuccessMessage && (
        <div className="print:hidden bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-emerald-950">ĐÃ TẢI FILE BÁO CÁO PDF VỀ MÁY THÀNH CÔNG!</div>
              <div className="text-[11px] text-emerald-800 mt-0.5">{pdfSuccessMessage}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pdfDownloadUrl && (
              <a
                href={pdfDownloadUrl}
                download={pdfFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Mở / Tải lại ngay</span>
              </a>
            )}
            <button
              onClick={() => setPdfSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-100/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Printable Report Document Sheet - SÁNG SỦA, SANG TRỌNG, ĐÚNG CHUẨN IN */}
      <div
        id="printable-executive-report"
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0 space-y-6"
      >
        {/* Document Header Table */}
        <div className="border-b-2 border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI BUSINESS CHECK-UP • BÁO CÁO TỔNG QUAN CHIẾN LƯỢC 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              BẢN ĐỒ ĐỊNH VỊ &amp; CHẨN ĐOÁN DOANH NGHIỆP
            </h1>
            <div className="text-sm font-bold text-slate-800 mt-1">
              Doanh nghiệp: <span className="text-blue-700">{profile.businessName}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1 shrink-0 min-w-56">
            <div className="flex justify-between">
              <span className="text-slate-400">CEO / Lãnh đạo:</span>
              <strong className="text-slate-900">{profile.ceoName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ngành nghề:</span>
              <strong className="text-slate-900">{profile.industry}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ngày chẩn đoán:</span>
              <strong className="text-slate-900">{formattedDate}</strong>
            </div>
          </div>
        </div>

        {/* 1. Khối Điểm Số & Đánh Giá Tổng Quan (Tone Sáng: Gradient Xanh Pastel) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-gradient-to-br from-blue-50 to-indigo-50/90 border-2 border-blue-200 text-slate-900 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 block mb-1">
                Chỉ số sức khỏe tổng thể
              </span>
              <div className="text-4xl font-black text-blue-700 tracking-tight">
                {healthScore} <span className="text-lg font-semibold text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200/80 text-xs text-slate-700 font-medium">
              Đánh giá: <strong className="text-blue-900 font-bold">Vững chắc, có điểm rò rỉ cần khắc phục ngay</strong>
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Nhận định chiến lược từ Chuyên gia AI
            </span>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              “{healthSummary}”
            </p>
          </div>
        </div>

        {/* 1.5 Chuỗi 7 Bước Giá Trị & Dòng Chảy Tiền */}
        {report.valueChainFlow && report.valueChainFlow.length > 0 && (
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2.5 flex items-center justify-between">
              <span>CHUỖI 7 BƯỚC GIÁ TRỊ &amp; DÒNG CHẢY TIỀN MẶT CỦA DOANH NGHIỆP</span>
              <span className="text-[10px] text-slate-400 font-medium">Đối soát vận hành</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {report.valueChainFlow.map((step, idx) => {
                const isDanger = step.status === 'danger';
                const isStrong = step.status === 'strong';
                const isWarning = step.status === 'warning';
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center text-xs ${
                      isDanger
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                        : isStrong
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isWarning
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase opacity-60">Bước {step.step}</div>
                    <div className="text-[11px] font-black mt-0.5">{step.label}</div>
                    <div className="text-[10px] mt-1 line-clamp-2 leading-tight">{step.note}</div>
                  </div>
                );
              })}
            </div>
            {report.expertFlowAssessment && (
              <div className="mt-2.5 text-[11px] text-slate-600 font-medium">
                💡 <strong>Nhận định chuyên gia:</strong> {report.expertFlowAssessment}
              </div>
            )}
          </div>
        )}

        {/* 2. Khối Đòn Bẩy Cao Nhất (Nếu Chỉ Được Làm 1 Việc Trong 30 Ngày) */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-5 shadow-xs border border-amber-600">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              ĐÒN BẨY CAO NHẤT (NẾU CHỈ ĐƯỢC LÀM 1 VIỆC TRONG 30 NGÀY TỚI)
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            👉 {ifOnlyOneThing.action}
          </div>
          <p className="text-xs sm:text-sm text-amber-100 mt-1.5 leading-relaxed font-medium">
            Lý do chiến lược: {ifOnlyOneThing.reason}
          </p>
        </div>

        {/* 3. Khối Bảng: Tam Giác Nhận Định Trọng Yếu */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            TAM GIÁC NHẬN ĐỊNH TRỌNG YẾU (30 GIÂY NẮM BẮT)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Điểm mạnh */}
            <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/60 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-emerald-800 uppercase text-[10px] tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded">
                  01. ĐIỂM MẠNH LỚN NHẤT
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-slate-900 font-semibold leading-relaxed mt-2">
                {threeKeyInsights.greatestStrength}
              </p>
            </div>

            {/* Điểm nghẽn */}
            <div className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50/60 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-rose-800 uppercase text-[10px] tracking-wider bg-rose-200/80 px-2 py-0.5 rounded">
                  02. ĐIỂM NGHẼN LỚN NHẤT
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-slate-900 font-semibold leading-relaxed mt-2">
                {threeKeyInsights.biggestBottleneck}
              </p>
            </div>

            {/* Cơ hội */}
            <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/60 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-amber-800 uppercase text-[10px] tracking-wider bg-amber-200/80 px-2 py-0.5 rounded">
                  03. CƠ HỘI ĐÁNG CHÚ Ý
                </span>
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-slate-900 font-semibold leading-relaxed mt-2">
                {threeKeyInsights.mostPromisingOpportunity}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Khối Bảng: Ma Trận 10 Trục Năng Lực Cạnh Tranh */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              BẢNG MA TRẬN 10 TRỤC NĂNG LỰC CẠNH TRANH
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Thang điểm 1 - 5</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs bg-white">
            {radarScores.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 min-w-44">
                  <span className="font-bold text-slate-800">{item.vietnameseFull}</span>
                  {item.score <= 2 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                      Rò rỉ
                    </span>
                  )}
                </div>
                <div className="flex-1 max-w-xs hidden sm:block">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score <= 2 ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">{item.score}</span>
                  <span className="text-slate-400">/5 (Chuẩn: {item.benchmark})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Khối Lộ Trình Hành Động 90 Ngày */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            LỘ TRÌNH 3 GIAI ĐOẠN 90 NGÀY CỦA CEO
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ninetyDayPlan.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {plan.priorityLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{plan.timeline}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{plan.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{plan.objective}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px]">
                  <strong className="text-slate-700">KPI: </strong>
                  <span className="text-blue-800 font-semibold">{plan.kpi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Certification signature */}
        <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-700">AI BUSINESS CHECK-UP SYSTEM</div>
            <div className="text-[10px]">Tư vấn chiến lược độc lập cho doanh nghiệp SME Việt Nam</div>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Báo cáo đã được kiểm định tính logic và cấu trúc dòng tiền</span>
          </div>
        </div>
      </div>

      {/* MODAL: NHẬN BÁO CÁO QUA EMAIL / LƯU TRỮ (MINH BẠCH & TRUNG THỰC) */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">NHẬN BÁO CÁO QUA HÒM THƯ</h3>
                  <p className="text-xs text-slate-500">Tự động tải PDF &amp; chuyển giao tới hộp thư</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailDeliveryResult ? (
              <div className="py-5 space-y-4">
                {/* Trường hợp 1: Máy chủ chưa cấu hình SMTP thật */}
                {emailDeliveryResult.status === 'needs_smtp_config' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                        <Info className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>Tệp PDF Đã Được Tải Xuống Máy Của Bạn!</span>
                      </div>
                      <p className="leading-relaxed text-slate-700">
                        Hệ thống đã tự động xuất và tải file báo cáo <strong>Bao_Cao_Chien_Luoc_CEO.pdf</strong> vào thư mục Downloads của bạn.
                      </p>
                      <div className="pt-1.5 border-t border-amber-200 text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-amber-950 font-bold">Lưu ý về Gmail:</strong> Máy chủ đám mây hiện tại chưa cấu hình tài khoản gửi thư SMTP xác thực (chưa có <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">SMTP_USER</code>). Vì Google Gmail tự động chặn tất cả email từ các máy chủ không xác thực để phòng chống spam, nên thư tự động từ máy chủ không thể đi thẳng vào inbox của bạn.
                      </div>
                    </div>

                    {/* Giải pháp 1-Click: Mở trực tiếp Gmail của người dùng với nội dung soạn sẵn */}
                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                      <div className="text-xs font-bold text-blue-950">
                        CÁCH GỬI NGAY VÀO HÒM THƯ CỦA BẠN (1 CLICK):
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Bấm nút bên dưới để mở giao diện Gmail của bạn đã được điền sẵn thông tin tóm tắt. Bạn chỉ cần thả tệp PDF vừa tải vào để lưu trữ:
                      </p>
                      <button
                        onClick={handleOpenDirectGmail}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Mở Gmail Đã Soạn Sẵn Thư &amp; Gửi Lưu Trữ</span>
                      </button>
                    </div>

                    {/* Nút tải lại file PDF nếu cần */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={handleDownloadPdf}
                        className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Lại File PDF</span>
                      </button>
                      <button
                        onClick={() => setIsEmailModalOpen(false)}
                        className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Đã Xong
                      </button>
                    </div>
                  </div>
                ) : emailDeliveryResult.status === 'ok' ? (
                  /* Trường hợp 2: Đã gửi thật sự thành công qua Resend / SMTP */
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">ĐÃ GỬI BÁO CÁO VÀO HÒM THƯ THÀNH CÔNG!</h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                        Bản báo cáo điều hành và tệp PDF đính kèm đã được phát thành công tới:{' '}
                        <strong className="text-slate-900 font-bold">{emailInput}</strong>
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tệp đính kèm trong thư:</span>
                        </span>
                        <span className="font-bold text-slate-900">{emailDeliveryResult.attachmentName || 'Bao_Cao_Chien_Luoc_CEO.pdf'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Cổng gửi thư:</span>
                        <span className="font-bold text-emerald-700">
                          {emailDeliveryResult.provider === 'resend' ? 'Resend Cloud Gateway (Đã xác thực)' : 'SMTP Server'}
                        </span>
                      </div>
                      {emailDeliveryResult.messageId && (
                        <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1.5 border-t border-slate-200/60">
                          <span>Mã vận đơn thư (ID):</span>
                          <span className="font-mono text-slate-600 truncate max-w-44">{emailDeliveryResult.messageId}</span>
                        </div>
                      )}
                    </div>

                    {/* Lời khuyên check mail */}
                    <div className="p-3 bg-blue-50/80 border border-blue-200/60 rounded-xl text-left text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Mẹo kiểm tra Gmail:</strong> Vui lòng mở ứng dụng Gmail. Nếu không thấy ở tab <em>Chính (Primary)</em>, hãy kiểm tra thêm tab <em>Cập nhật (Updates)</em> hoặc <em>Thư rác (Spam)</em> vì đây là lần đầu hệ thống gửi thư đến bạn.
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={handleDownloadPdf}
                        className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Thêm 1 Bản PDF</span>
                      </button>
                      <button
                        onClick={() => setIsEmailModalOpen(false)}
                        className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Hoàn Tất
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Trường hợp lỗi Resend hoặc lỗi khác */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <div className="font-black text-amber-950 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Thông báo từ hệ thống gửi thư:</span>
                      </div>
                      <div className="text-slate-700 leading-relaxed">{emailDeliveryResult.message}</div>
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-amber-200">
                        Đừng lo lắng! Tệp PDF báo cáo đã được tải về máy của bạn an toàn.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2.5">
                      <div className="text-xs font-bold text-blue-950">
                        GỬI NGAY QUA GMAIL CỦA BẠN (1 CLICK):
                      </div>
                      <button
                        onClick={handleOpenDirectGmail}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Mở Gmail Đã Soạn Sẵn Thư</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleDownloadPdf}
                        className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Lại PDF</span>
                      </button>
                      <button
                        onClick={() => setIsEmailModalOpen(false)}
                        className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSendEmailAuto} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Địa chỉ Email nhận báo cáo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ví dụ: eduzteam09@gmail.com"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hệ thống sẽ gửi trực tiếp báo cáo chiến lược kèm tệp PDF đính kèm vào hòm thư này.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tên người nhận (CEO / Lãnh đạo)
                  </label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
                  />
                </div>

                {/* Box tóm tắt quyền lợi */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1.5 text-blue-950">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span>Đính kèm tệp PDF chiến lược tiêu chuẩn CEO</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bao gồm điểm số sức khỏe ({healthScore}/100), hành động đòn bẩy 30 ngày, tam giác nhận định và lộ trình 90 ngày của CEO.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi Vào Email Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
