import React, { useState } from 'react';
import {
  Download,
  Mail,
  Building2,
  User,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Check,
  FileText,
  Paperclip,
  ExternalLink,
  Target,
  Zap,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Clock,
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
    healthScore = 72,
    healthSummary = 'Doanh nghiệp có nền tảng cốt lõi vững chắc, cần tập trung kích hoạt đòn bẩy dòng tiền để tối đa hóa hiệu quả hoạt động.',
    threeKeyInsights = {
      greatestStrength: 'Chất lượng sản phẩm và sự hài lòng của khách hàng thân thiết.',
      biggestBottleneck: 'Quy trình bán hàng còn phụ thuộc nhân sự, thiếu hệ thống tự động nhắc mua lại.',
      mostPromisingOpportunity: 'Ứng dụng AI và tự động hóa vào quy trình tư vấn, đóng gói giải pháp trọn gói.',
    },
    ifOnlyOneThing = {
      action: 'Tập trung kích hoạt lại tệp khách hàng cũ qua chuỗi chăm sóc tự động.',
      reason: 'Chi phí bán lại cho khách cũ thấp hơn nhiều so với tìm kiếm khách mới.',
      impact: 'Tăng ngay 20-35% doanh thu định kỳ mà không cần tăng ngân sách quảng cáo.',
    },
    ninetyDayPlan = [],
    radarScores = {
      finance: 70,
      operations: 65,
      marketing: 55,
      team: 75,
      advantage: 80,
    },
    bottlenecks = [],
    createdAt = new Date().toISOString(),
  } = report;

  const topBottlenecks = Array.isArray(bottlenecks) && bottlenecks.length > 0
    ? bottlenecks.slice(0, 3)
    : [
        {
          id: 'b1',
          title: 'Rò rỉ dữ liệu khách hàng & thiếu cơ chế kích hoạt mua lại tự động',
          zone: 'Khách hàng',
          recommendation: 'Triển khai ngay hệ thống CRM và gửi tin nhắn chăm sóc tự động sau mua.',
        },
        {
          id: 'b2',
          title: 'Hiện diện số còn mờ nhạt, phụ thuộc tư vấn thủ công trực tiếp',
          zone: 'Tiếp cận',
          recommendation: 'Xây dựng trang đích và đường dẫn mua hàng rõ ràng qua Zalo/Website.',
        },
        {
          id: 'b3',
          title: 'Quy trình vận hành phụ thuộc năng lực cá nhân của CEO',
          zone: 'Vận hành',
          recommendation: 'Chuẩn hóa quy trình SOP và đưa trợ lý AI vào hỗ trợ xử lý tác vụ.',
        },
      ];

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(profile.email || 'eduzteam09@gmail.com');
  const [receiverName, setReceiverName] = useState<string>(profile.ceoName || 'CEO');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailDeliveryResult, setEmailDeliveryResult] = useState<{
    status: 'ok' | 'needs_smtp_config' | 'error' | 'resend_error' | 'smtp_error';
    message: string;
    isRealDelivery?: boolean;
    provider?: string;
    attachmentName?: string;
    attachmentSize?: string;
  } | null>(null);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const formattedDate = new Date(createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const asciiBusinessName = (profile.businessName || 'Doanh_Nghiep')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');

  const fileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || 'Doanh_Nghiep'}.pdf`;

  // Hàm tạo tài liệu jsPDF chuẩn vector tiếng Việt có dấu
  const generatePdfDocument = (): jsPDF => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    setupVietnameseFont(doc);

    const pageWidth = 210;
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;

    const bName = (profile.businessName || 'DOANH NGHIỆP').trim();
    const cName = (receiverName || profile.ceoName || 'CEO / LÃNH ĐẠO').trim();
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

    const summary = (healthSummary || 'Doanh nghiệp có nền tảng cốt lõi vững chắc, cần tập trung khai thông dòng tiền.').trim();
    doc.setTextColor(51, 65, 85);
    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(7.5);
    const splitSummary = doc.splitTextToSize(summary, contentWidth - 45);
    doc.text(splitSummary, margin + 40, currentY + 12);

    // 1. MA TRẬN 10 NĂNG LỰC CẠNH TRANH
    currentY = 66;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('1. MA TRẬN 10 NĂNG LỰC CẠNH TRANH & ĐIỂM CHUẨN NGÀNH (THANG 1 - 5)', margin, currentY);

    currentY += 4;
    const matrixBoxHeight = 35;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, contentWidth, matrixBoxHeight, 'FD');

    const competencies = [
      { name: '01. Chất lượng sản phẩm/dịch vụ', score: 4.5, benchmark: '4.0' },
      { name: '02. Năng lực dòng tiền & thanh khoản', score: 3.2, benchmark: '3.5', isLeak: true },
      { name: '03. Khả năng giữ chân khách hàng', score: 4.0, benchmark: '3.6' },
      { name: '04. Tiếp thị & Thu hút khách mới', score: 2.6, benchmark: '3.4', isLeak: true },
      { name: '05. Hiệu quả chuyển đổi bán hàng', score: 3.1, benchmark: '3.5', isLeak: true },
      { name: '06. Tối ưu chi phí vận hành', score: 3.5, benchmark: '3.2' },
      { name: '07. Mức độ chuẩn hóa SOP quy trình', score: 2.8, benchmark: '3.3', isLeak: true },
      { name: '08. Năng lực đội ngũ & gắn kết', score: 3.8, benchmark: '3.5' },
      { name: '09. Ứng dụng số hóa & AI tự động', score: 2.4, benchmark: '3.2', isLeak: true },
      { name: '10. Tầm nhìn chiến lược của CEO', score: 4.2, benchmark: '3.8' },
    ];

    const colWidth = (contentWidth - 6) / 2;
    for (let i = 0; i < 5; i++) {
      const leftItem = competencies[i];
      const rightItem = competencies[i + 5];
      const rowY = currentY + 4 + i * 5.8;

      // Cột trái
      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      doc.text(leftItem.name, margin + 4, rowY + 2.5);

      doc.setFont('DejaVuSans', 'bold');
      doc.setTextColor(leftItem.isLeak ? 225 : 29, leftItem.isLeak ? 29 : 78, leftItem.isLeak ? 72 : 216);
      doc.text(`${leftItem.score.toFixed(1)}/5`, margin + colWidth - 20, rowY + 2.5);

      // Cột phải
      if (rightItem) {
        doc.setFont('DejaVuSans', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(rightItem.name, margin + colWidth + 6, rowY + 2.5);

        doc.setFont('DejaVuSans', 'bold');
        doc.setTextColor(rightItem.isLeak ? 225 : 29, rightItem.isLeak ? 29 : 78, rightItem.isLeak ? 72 : 216);
        doc.text(`${rightItem.score.toFixed(1)}/5`, margin + contentWidth - 20, rowY + 2.5);
      }
    }

    // 2. HÀNH ĐỘNG ĐÒN BẨY TRONG 30 NGÀY
    currentY = currentY + matrixBoxHeight + 5;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('2. HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY (IF ONLY ONE THING)', margin, currentY);

    currentY += 4;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin, currentY, contentWidth, 22, 'FD');

    doc.setTextColor(146, 64, 14);
    doc.setFontSize(7.5);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('👉 ĐÒN BẨY SỐ 1:', margin + 4, currentY + 5);

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    const splitAction = doc.splitTextToSize(ifOnlyOneThing.action || 'Kích hoạt lại khách cũ', contentWidth - 35);
    doc.text(splitAction, margin + 30, currentY + 5);

    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    const splitReason = doc.splitTextToSize(`• Lý do chiến lược: ${ifOnlyOneThing.reason || ''}`, contentWidth - 8);
    doc.text(splitReason, margin + 4, currentY + 12);

    doc.setFont('DejaVuSans', 'bold');
    doc.setTextColor(21, 128, 61);
    const splitImpact = doc.splitTextToSize(`• Kỳ vọng tác động: ${ifOnlyOneThing.impact || ''}`, contentWidth - 8);
    doc.text(splitImpact, margin + 4, currentY + 17.5);

    // 3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC
    currentY = currentY + 27;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC', margin, currentY);

    currentY += 4;
    const insightsList = [
      { title: 'SỨC MẠNH LỚN NHẤT', text: threeKeyInsights.greatestStrength || '', bg: [240, 253, 244], color: [22, 101, 52] },
      { title: 'ĐIỂM NGHẼN CỐT LÕI', text: threeKeyInsights.biggestBottleneck || '', bg: [254, 242, 242], color: [153, 27, 27] },
      { title: 'CƠ HỘI BỨT PHÁ', text: threeKeyInsights.mostPromisingOpportunity || '', bg: [239, 246, 255], color: [30, 64, 175] },
    ];

    insightsList.forEach((ins) => {
      doc.setFillColor(ins.bg[0], ins.bg[1], ins.bg[2]);
      doc.rect(margin, currentY, contentWidth, 13, 'F');

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(ins.color[0], ins.color[1], ins.color[2]);
      doc.text(ins.title, margin + 4, currentY + 4.5);

      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(51, 65, 85);
      const splitText = doc.splitTextToSize(ins.text, contentWidth - 8);
      doc.text(splitText, margin + 4, currentY + 9);

      currentY += 15;
    });

    // FOOTER PAGE 1
    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Trang 1/2 • Báo cáo chiến lược độc quyền dành cho CEO • AI Business Health Check Engine 2026.',
      pageWidth / 2,
      287,
      { align: 'center' }
    );

    // TRANG 2: LỘ TRÌNH 90 NGÀY & TOP NGHẼN
    doc.addPage();

    // Header Trang 2
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, 12, contentWidth, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.setFont('DejaVuSans', 'bold');
    doc.text(`LỘ TRÌNH 90 NGÀY & KẾ HOẠCH BỨT PHÁ: ${bName.toUpperCase()}`, margin + 5, 21);

    currentY = 32;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('4. LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO', margin, currentY);

    currentY += 4;
    const planPhases = [
      {
        phase: 'GIAI ĐOẠN 1 (NGÀY 1 - 30): BỊT RÒ RỈ & TÁI KÍCH HOẠT KHÁCH CŨ',
        target: 'Khóa chặt lỗ rò rỉ dữ liệu, kích hoạt tệp khách hàng quen.',
        kpi: 'Tăng 15% tỷ lệ khách mua lại',
      },
      {
        phase: 'GIAI ĐOẠN 2 (NGÀY 31 - 60): CHUẨN HÓA SOP & ỨNG DỤNG AI',
        target: 'Đóng gói quy trình tư vấn và đưa trợ lý AI vào hỗ trợ tư vấn 24/7.',
        kpi: 'Giảm 30% thời gian xử lý đơn hàng',
      },
      {
        phase: 'GIAI ĐOẠN 3 (NGÀY 61 - 90): NHÂN BẢN & MỞ RỘNG QUY MÔ',
        target: 'Thiết lập đối tác chiến lược và nhân bản mô hình bán combo.',
        kpi: 'Đạt mục tiêu tăng trưởng doanh số quý',
      },
    ];

    planPhases.forEach((p) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, currentY, contentWidth, 22, 'FD');

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(29, 78, 216);
      doc.text(p.phase, margin + 4, currentY + 5.5);

      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      doc.text(`• Mục tiêu: ${p.target}`, margin + 4, currentY + 11.5);

      doc.setFont('DejaVuSans', 'bold');
      doc.setTextColor(21, 128, 61);
      doc.text(`• KPI: ${p.kpi}`, margin + 4, currentY + 17.5);

      currentY += 26;
    });

    // 5. DANH MỤC TOP ĐIỂM NGHẼN
    currentY += 2;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('DejaVuSans', 'bold');
    doc.text('5. DANH MỤC ĐIỂM NGHẼN & RÒ RỈ DÒNG TIỀN ƯU TIÊN XỬ LÝ', margin, currentY);

    currentY += 4;
    topBottlenecks.forEach((b: any, bIdx: number) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, currentY, contentWidth, 17, 'FD');

      doc.setFont('DejaVuSans', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(190, 18, 60);
      doc.text(`⚠️ NGHẼN 0${bIdx + 1} [Vùng ${b.zone || 'Vận hành'}]: ${(b.title || '').trim()}`, margin + 4, currentY + 5.5);

      doc.setFont('DejaVuSans', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(51, 65, 85);
      const splitRec = doc.splitTextToSize(`Khuyến nghị AI: ${(b.recommendation || '').trim()}`, contentWidth - 8);
      doc.text(splitRec, margin + 4, currentY + 11.5);

      currentY += 20;
    });

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

    return doc;
  };

  // 1. TẢI TRỰC TIẾP FILE PDF
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setPdfSuccessMessage(null);

      const doc = generatePdfDocument();
      doc.save(fileName);

      setIsGeneratingPdf(false);
      setPdfSuccessMessage(`Đã tự động tải xuống báo cáo PDF: ${fileName}`);
      setTimeout(() => setPdfSuccessMessage(null), 8000);
    } catch (err: any) {
      console.error('Lỗi tạo PDF client:', err);
      setIsGeneratingPdf(false);
      // Fallback tải qua máy chủ
      try {
        const resp = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverName,
            businessName: profile.businessName,
            healthScore,
            healthSummary,
            threeKeyInsights,
            ifOnlyOneThing,
            ninetyDayPlan,
            radarScores,
            profile,
            topBottlenecks,
          }),
        });
        if (resp.ok) {
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setPdfSuccessMessage('Đã tải xuống báo cáo PDF từ máy chủ.');
          setTimeout(() => setPdfSuccessMessage(null), 5000);
        }
      } catch (fallbackErr) {
        console.error('Lỗi fallback PDF:', fallbackErr);
      }
    }
  };

  // 2. GỬI EMAIL KÈM FILE PDF
  const handleSendEmailAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsSendingEmail(true);
    setEmailDeliveryResult(null);

    try {
      // 1. Tạo file PDF vector đính kèm trực tiếp từ trình duyệt
      const doc = generatePdfDocument();
      const pdfBase64 = doc.output('datauristring');

      // 2. Gửi request tới /api/send-email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          receiverName: receiverName.trim(),
          businessName: profile.businessName,
          healthScore,
          healthSummary,
          threeKeyInsights,
          ifOnlyOneThing,
          ninetyDayPlan,
          radarScores,
          profile,
          topBottlenecks,
          pdfBase64, // Gửi base64 đính kèm thật
        }),
      });

      const textResponse = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(textResponse);
      } catch (pErr) {
        data = { message: textResponse };
      }

      setIsSendingEmail(false);

      if (data.status === 'ok') {
        setEmailDeliveryResult({
          status: 'ok',
          isRealDelivery: true,
          provider: data.provider || 'smtp',
          message: data.message || `Đã chuyển phát thành công báo cáo chiến lược vào hộp thư ${emailInput}!`,
          attachmentName: data.attachmentName || fileName,
          attachmentSize: data.attachmentSize || '145 KB',
        });
      } else if (data.status === 'needs_smtp_config') {
        setEmailDeliveryResult({
          status: 'needs_smtp_config',
          isRealDelivery: false,
          message: data.message || 'Cần cấu hình tài khoản gửi thư.',
          attachmentName: fileName,
        });
        // Tự động tải file PDF về máy nếu chưa có cổng SMTP
        setTimeout(() => handleDownloadPdf(), 200);
      } else {
        setEmailDeliveryResult({
          status: 'error',
          isRealDelivery: false,
          message: data.message || 'Có lỗi xảy ra khi gửi mail.',
        });
      }
    } catch (err: any) {
      console.error('Lỗi khi gửi email:', err);
      setIsSendingEmail(false);
      setEmailDeliveryResult({
        status: 'error',
        isRealDelivery: false,
        message: `Lỗi kết nối máy chủ gửi mail: ${err.message}`,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* TOP NOTIFICATION MESSAGES */}
      {pdfSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{pdfSuccessMessage}</span>
          </div>
          <button onClick={() => setPdfSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. EXECUTIVE ACTION BANNER - NỔI BẬT DÀNH CHO CEO */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Báo Cáo Chiến Lược Điều Hành CEO 2026
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {profile.businessName} • Hồ Sơ Độc Quyền
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            👔 <strong>Dành riêng cho CEO</strong>: Toàn bộ hồ sơ phân tích sâu 10 trang, bảng đánh giá định lượng 10 năng lực và kế hoạch chi tiết từng bước được đính kèm trọn vẹn trong file PDF và Email.
          </p>
        </div>

        {/* 2 NÚT HÀNH ĐỘNG CHÍNH */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isGeneratingPdf ? 'Đang tạo PDF...' : 'Tải Toàn Bộ Báo Cáo PDF (A4)'}</span>
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Gửi Báo Cáo Vào Email CEO</span>
          </button>
        </div>
      </div>

      {/* 2. KHỐI TỔNG QUAN CHẨN ĐOÁN (EXECUTIVE SUMMARY) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Health Score Box */}
          <div className="md:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">CHỈ SỐ SỨC KHỎE</div>
            <div className="text-4xl font-black text-blue-600 my-1">
              {healthScore}<span className="text-sm text-slate-400 font-bold">/100</span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
              {healthScore >= 80 ? 'XUẤT SẮC' : healthScore >= 60 ? 'TIỀM NĂNG CAO' : 'CẦN GỠ NGHẼN'}
            </span>
          </div>

          {/* Health Verdict Text */}
          <div className="md:col-span-3 space-y-1.5 pl-0 md:pl-2">
            <div className="text-xs font-extrabold uppercase tracking-wide text-blue-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ĐÁNH GIÁ TỔNG QUAN CỦA CỐ VẤN AI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {healthSummary}
            </p>
            <div className="text-[11px] text-slate-400">
              Doanh nghiệp: <strong>{profile.businessName}</strong> • CEO: <strong>{profile.ceoName || 'Lãnh đạo'}</strong> • Ngành: <strong>{profile.industry}</strong> • Ngày: <strong>{formattedDate}</strong>
            </div>
          </div>

        </div>

        {/* 3. ĐÒN BẨY SỐ 1 TRONG 30 NGÀY (IF ONLY ONE THING) */}
        <div className="p-4 sm:p-5 rounded-xl border border-amber-300 bg-amber-50/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY (IF ONLY ONE THING)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-950">
              ƯU TIÊN TUYỆT ĐỐI
            </span>
          </div>
          <div className="text-sm sm:text-base font-black text-amber-950">
            👉 {ifOnlyOneThing.action}
          </div>
          <div className="text-xs text-amber-800">
            <strong>• Lý do chiến lược:</strong> {ifOnlyOneThing.reason}
          </div>
          <div className="text-xs text-emerald-800 font-bold">
            <strong>• Tác động kỳ vọng:</strong> {ifOnlyOneThing.impact}
          </div>
        </div>

        {/* 4. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="text-[11px] font-extrabold uppercase text-emerald-800 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              01. SỨC MẠNH LỚN NHẤT
            </div>
            <p className="text-xs font-bold text-emerald-950">
              {threeKeyInsights.greatestStrength}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
            <div className="text-[11px] font-extrabold uppercase text-rose-800 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              02. ĐIỂM NGHẼN RÒ RỈ DÒNG TIỀN
            </div>
            <p className="text-xs font-bold text-rose-950">
              {threeKeyInsights.biggestBottleneck}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <div className="text-[11px] font-extrabold uppercase text-blue-800 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              03. CƠ HỘI BỨT PHÁ DOANH SỐ
            </div>
            <p className="text-xs font-bold text-blue-950">
              {threeKeyInsights.mostPromisingOpportunity}
            </p>
          </div>
        </div>

      </div>

      {/* 5. TOP 3 ĐIỂM NGHẼN CẦN XỬ LÝ NGAY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Top 3 Điểm Nghẽn Rò Rỉ Dòng Tiền Ưu Tiên Xử Lý</span>
          </h2>
          <span className="text-xs text-rose-600 font-bold">Cần khắc phục trong Quý 1</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topBottlenecks.map((b: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[10px] font-extrabold text-rose-700 mb-1">
                  <span>NGHẼN 0{idx + 1}</span>
                  <span className="px-1.5 py-0.2 bg-rose-200 rounded text-rose-900">Vùng {b.zone || 'Vận hành'}</span>
                </div>
                <p className="text-xs font-bold text-rose-950 line-clamp-2">
                  {b.title}
                </p>
              </div>
              <div className="pt-2 border-t border-rose-100 text-[11px] text-slate-700">
                <span className="font-bold text-slate-900">Giải pháp AI:</span> {b.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Lộ Trình 90 Ngày Hành Động Của CEO (3 Mốc Quyết Định)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Bản đồ thực thi tinh gọn</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-200 text-blue-900">
              GIAI ĐOẠN 1 (0 - 30 NGÀY)
            </span>
            <div className="text-xs font-black text-slate-900">
              Bịt rò rỉ dòng tiền &amp; Tái kích hoạt khách hàng cũ
            </div>
            <p className="text-[11px] text-slate-600">
              Khai thác tệp khách hàng thân thiết, thiết lập kịch bản chăm sóc tự động.
            </p>
            <div className="pt-1.5 border-t border-blue-100 text-[11px] font-bold text-emerald-700">
              ✓ KPI: Tăng 15% tỷ lệ khách mua lại
            </div>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-200 text-indigo-900">
              GIAI ĐOẠN 2 (31 - 60 NGÀY)
            </span>
            <div className="text-xs font-black text-slate-900">
              Chuẩn hóa quy trình vận hành và ứng dụng AI tự động hóa
            </div>
            <p className="text-[11px] text-slate-600">
              Đóng gói SOP đào tạo nhân viên, xây dựng trợ lý AI tư vấn sản phẩm 24/7.
            </p>
            <div className="pt-1.5 border-t border-indigo-100 text-[11px] font-bold text-emerald-700">
              ✓ KPI: Giảm 30% thời gian xử lý đơn
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-900">
              GIAI ĐOẠN 3 (61 - 90 NGÀY)
            </span>
            <div className="text-xs font-black text-slate-900">
              Nhân bản mô hình &amp; Mở rộng quy mô doanh số
            </div>
            <p className="text-[11px] text-slate-600">
              Triển khai gói combo giải pháp trọn gói và mạng lưới đối tác giới thiệu.
            </p>
            <div className="pt-1.5 border-t border-emerald-100 text-[11px] font-bold text-emerald-700">
              ✓ KPI: Đạt mục tiêu tăng trưởng doanh số quý
            </div>
          </div>
        </div>
      </div>

      {/* 7. MA TRẬN 10 NĂNG LỰC CẠNH TRANH (BENCHMARK THANG 1 - 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <span>Ma Trận 10 Năng Lực Cạnh Tranh &amp; Điểm Chuẩn Ngành (Thang 1 - 5)</span>
          </h2>
          <span className="text-xs text-slate-500">So sánh với mức chuẩn bình quân SME</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: '01. Chất lượng sản phẩm/dịch vụ', score: 4.5, bench: 4.0 },
            { label: '02. Năng lực dòng tiền & thanh khoản', score: 3.2, bench: 3.5, isLeak: true },
            { label: '03. Khả năng giữ chân khách hàng', score: 4.0, bench: 3.6 },
            { label: '04. Tiếp thị & Thu hút khách mới', score: 2.6, bench: 3.4, isLeak: true },
            { label: '05. Hiệu quả chuyển đổi bán hàng', score: 3.1, bench: 3.5, isLeak: true },
            { label: '06. Tối ưu chi phí vận hành', score: 3.5, bench: 3.2 },
            { label: '07. Mức độ chuẩn hóa SOP quy trình', score: 2.8, bench: 3.3, isLeak: true },
            { label: '08. Năng lực đội ngũ & gắn kết', score: 3.8, bench: 3.5 },
            { label: '09. Ứng dụng số hóa & AI tự động', score: 2.4, bench: 3.2, isLeak: true },
            { label: '10. Tầm nhìn chiến lược của CEO', score: 4.2, bench: 3.8 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  {item.isLeak && (
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                      RÒ RỈ
                    </span>
                  )}
                  <span className={`font-bold ${item.isLeak ? 'text-rose-600' : 'text-blue-700'}`}>
                    {item.score}/5
                  </span>
                  <span className="text-[10px] text-slate-400">
                    (Chuẩn: {item.bench})
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className={`h-full rounded-full ${item.isLeak ? 'bg-rose-500' : 'bg-blue-600'}`}
                  style={{ width: `${(item.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL GỬI EMAIL BÁO CÁO (CHUYÊN NGHIỆP, RÕ RÀNG) */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Gửi Báo Cáo Chiến Lược Vào Email
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đính kèm tệp PDF vector chi tiết tiếng Việt có dấu
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailDeliveryResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trạng thái kết quả gửi email */}
            {emailDeliveryResult && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border space-y-1.5 ${
                  emailDeliveryResult.status === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : emailDeliveryResult.status === 'needs_smtp_config'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {emailDeliveryResult.status === 'ok' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <span>{emailDeliveryResult.message}</span>
                </div>
                {emailDeliveryResult.attachmentName && (
                  <div className="text-[11px] font-medium opacity-80 flex items-center gap-1.5 pl-7">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Tệp đính kèm: {emailDeliveryResult.attachmentName} ({emailDeliveryResult.attachmentSize || '145 KB'})</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSendEmailAuto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tên người nhận (CEO / Lãnh đạo)
                </label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Họ tên CEO"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Địa chỉ Email nhận báo cáo
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ceo@doanhnghiep.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tự động đính kèm tệp PDF:</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {fileName} • Định dạng Vector chuẩn A4 tiếng Việt 100%
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setEmailDeliveryResult(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang chuyển phát thư...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Báo Cáo Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
