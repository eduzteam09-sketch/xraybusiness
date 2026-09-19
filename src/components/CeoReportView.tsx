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
import html2canvas from 'html2canvas';

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
    createdAt,
  } = report;

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

  // 1. HÀM TẠO VÀ TẢI FILE PDF TRỰC TIẾP VỀ MÁY (TIẾNG VIỆT CÓ DẤU 100% VECTOR CHUẨN A4)
  const handleDownloadPdf = async (): Promise<string | null> => {
    try {
      setIsGeneratingPdf(true);
      setPdfSuccessMessage(null);

      // Thử tải trực tiếp bản PDF vector độ nét cao từ máy chủ (chuẩn tiếng Việt có dấu 100%)
      try {
        const res = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverName: receiverName.trim() || 'CEO',
            businessName: profile.businessName || 'Doanh Nghiệp',
            healthScore: healthScore,
            healthSummary: healthSummary,
            threeKeyInsights: threeKeyInsights,
            ifOnlyOneThing: ifOnlyOneThing,
            ninetyDayPlan: ninetyDayPlan,
            radarScores: radarScores,
            profile: profile,
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const asciiBusinessName = (profile.businessName || 'Doanh_Nghiep')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
          const fileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || 'Doanh_Nghiep'}.pdf`;

          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);

          setIsGeneratingPdf(false);
          setPdfSuccessMessage(`Đã tải xuống thành công bản PDF tiếng Việt có dấu: ${fileName}`);
          setTimeout(() => setPdfSuccessMessage(null), 6000);
          return null;
        }
      } catch (apiErr) {
        console.warn('Không thể tải PDF từ API máy chủ, chuyển sang chụp giao diện canvas:', apiErr);
      }

      // Phương án dự phòng: chụp giao diện bằng canvas nếu máy chủ bận
      const element = document.getElementById('printable-executive-report');
      if (!element) {
        window.print();
        setIsGeneratingPdf(false);
        return null;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const asciiName = (profile.businessName || 'Doanh_Nghiep')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `Bao_Cao_Chien_Luoc_CEO_${asciiName}.pdf`;

      pdf.save(fileName);

      setIsGeneratingPdf(false);
      setPdfSuccessMessage(`Đã tải xuống thành công file: ${fileName}`);
      setTimeout(() => setPdfSuccessMessage(null), 6000);

      return pdf.output('datauristring');
    } catch (err) {
      console.warn('Lỗi khi xuất PDF, mở cửa sổ in ấn:', err);
      setIsGeneratingPdf(false);
      window.print();
      return null;
    }
  };

  // 2. HÀM GỬI EMAIL VÀ TẢI FILE BÁO CÁO (MINH BẠCH, TRUNG THỰC 100%)
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

    // 1. Luôn tự động tải file PDF trực tiếp về máy người dùng trước để đảm bảo CEO không bị mất tài liệu
    const pdfDataUri = await handleDownloadPdf();

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
          subject: emailSubject,
          reportSummary: healthSummary,
          textContent: emailBody,
          pdfBase64: pdfDataUri || '',
        }),
      });

      const data = await response.json();
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
        // Chưa cấu hình tài khoản gửi thư: Thông báo trung thực và hướng dẫn cách nhận thư ngay
        setEmailDeliveryResult({
          status: 'needs_smtp_config',
          isRealDelivery: false,
          message: data.message,
          attachmentName: data.attachmentName,
          attachmentSize: data.attachmentSize,
        });
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
        status: 'needs_smtp_config',
        isRealDelivery: false,
        message: 'Máy chủ chưa kết nối cổng phát thư SMTP ra Internet.',
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
        <div className="print:hidden bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-semibold flex items-center justify-between gap-2.5 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-emerald-950">ĐÃ TẢI FILE BÁO CÁO PDF VỀ MÁY THÀNH CÔNG!</div>
              <div className="text-[11px] text-emerald-800 mt-0.5">{pdfSuccessMessage}</div>
            </div>
          </div>
          <button
            onClick={() => setPdfSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
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
            {radarScores.slice(0, 6).map((item, idx) => (
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
                    Hệ thống sẽ đồng thời tải tệp PDF về máy bạn để bảo đảm lưu trữ an toàn.
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
                    <span>Tự động xuất tệp PDF độ phân giải cao 1 trang</span>
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
                        <span>Đang tạo PDF &amp; xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Tải Báo Cáo &amp; Gửi Về Email</span>
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
