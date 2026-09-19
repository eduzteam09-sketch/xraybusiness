import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Compass,
  Grid,
  Coins,
  Cpu,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Building2,
  User,
  Calendar,
  Layers,
  Flame,
  BarChart3,
} from 'lucide-react';
import { DiagnosisReport } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface HomeOverviewProps {
  report: DiagnosisReport | null;
  onStartCheckup: () => void;
  onNavigateToTab: (tab: string) => void;
  onExploreSample?: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  report,
  onStartCheckup,
  onNavigateToTab,
  onExploreSample,
}) => {
  const [whyModalData, setWhyModalData] = useState<{
    isOpen: boolean;
    title: string;
    topic: string;
    dataObserved: string[];
    findings: string;
    strategicRationale: string;
    confidence: 'high' | 'medium' | 'low';
    actionAdvice?: string;
  }>({
    isOpen: false,
    title: '',
    topic: '',
    dataObserved: [],
    findings: '',
    strategicRationale: '',
    confidence: 'high',
  });

  // Guard against null report: render an elegant, professional empty state
  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Chưa có dữ liệu chẩn đoán doanh nghiệp</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Hãy bắt đầu phiên đối thoại chiến lược với Cố vấn AI để phân tích 9 danh mục vận hành và nhận bản đồ định vị tăng trưởng.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={onStartCheckup}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
            >
              Bắt đầu khám doanh nghiệp ngay
            </button>
            {onExploreSample && (
              <button
                onClick={onExploreSample}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                Xem hồ sơ mẫu minh họa
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Business Profile from actual report
  const profile = report.profile;

  const healthScore = report.healthScore ?? 70;
  const healthSummary =
    report.healthSummary ||
    `Doanh nghiệp ${profile.businessName} sở hữu năng lực sản phẩm và uy tín thực tế, đang cần tháo gỡ điểm nghẽn để bứt phá dòng tiền.`;

  const ifOnlyOneThing = report.ifOnlyOneThing || {
    action: 'Tập trung xây dựng cơ chế kích hoạt khách hàng cũ mua lại tự động.',
    reason: 'Chi phí bán lại cho khách cũ thấp hơn nhiều so với tìm kiếm khách mới.',
    leverageBottleneck: 'Dòng tiền & Giữ chân khách',
  };

  const threeKeyInsights = report.threeKeyInsights || {
    greatestStrength: `Chất lượng ${profile.coreOfferings || 'sản phẩm/dịch vụ'} và lòng tin từ tệp khách hàng thân thiết.`,
    biggestBottleneck: 'Chưa có hệ thống tự động để chăm sóc và tái kích hoạt khách hàng định kỳ.',
    mostPromisingOpportunity: 'Số hóa điểm chạm và đóng gói các gói dịch vụ/sản phẩm trọn gói.',
  };

  // Helper to get styling based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong':
        return 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
      case 'danger':
        return 'bg-rose-100 border-rose-400 text-rose-950 font-black';
      case 'warning':
        return 'bg-amber-50 border-amber-400 text-amber-950 font-medium';
      default:
        return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  // Strategic positioning flow nodes: dynamically bound to the actual business report
  const rawFlowSteps = report.valueChainFlow && report.valueChainFlow.length === 7
    ? report.valueChainFlow
    : [
        {
          step: '01',
          label: 'THỊ TRƯỜNG',
          status: 'normal' as const,
          note: `Thị trường ${profile.industry || 'kinh doanh'} tiếp tục mở rộng`,
        },
        {
          step: '02',
          label: 'KHÁCH HÀNG',
          status: 'strong' as const,
          note: report.positioningSummary?.targetTier || 'Khách hàng mục tiêu đánh giá cao chất lượng phục vụ',
        },
        {
          step: '03',
          label: 'GIÁ TRỊ',
          status: 'strong' as const,
          note: report.canvas?.valuePropositions?.current?.[0] || profile.coreOfferings || 'Sản phẩm/dịch vụ cốt lõi đáp ứng đúng cam kết',
        },
        {
          step: '04',
          label: 'KHÁC BIỆT',
          status: 'warning' as const,
          note: report.differentiation?.[0]?.title || 'Cần chuẩn hóa lợi thế cạnh tranh độc nhất',
        },
        {
          step: '05',
          label: 'MÔ HÌNH',
          status: 'normal' as const,
          note: report.canvas?.channels?.current?.[0] || 'Vận hành kênh bán và phân phối hiện tại',
        },
        {
          step: '06',
          label: 'DÒNG TIỀN',
          status: 'danger' as const,
          note: report.bottlenecks?.[0]?.title || 'Rò rỉ ở khâu giữ chân và nhắc khách mua lại',
        },
        {
          step: '07',
          label: 'TĂNG TRƯỞNG',
          status: 'warning' as const,
          note: report.ninetyDayPlan?.[0]?.expectedResult || 'Cần đòn bẩy chiến lược để bứt phá doanh thu',
        },
      ];

  const flowSteps = rawFlowSteps.map((s) => ({
    ...s,
    color: getStatusColor(s.status),
  }));

  const expertFlowAssessment = report.expertFlowAssessment ||
    `Năng lực sản phẩm cốt lõi và lòng tin khách hàng của ${profile.businessName} rất tốt, nhưng dòng tiền đang bị rò rỉ ở khâu ${ifOnlyOneThing.leverageBottleneck || 'DÒNG TIỀN & MUA LẠI'}.`;

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* 0. WELCOME HEADER BAR (BẢNG THÔNG TIN DOANH NGHIỆP) */}
      <div 
        id="home-executive-header"
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-900">
                Chào mừng CEO <span className="text-blue-700">{profile.ceoName}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Bản Đồ Doanh Nghiệp 2026
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {profile.businessName}
              </span>
              <span>•</span>
              <span className="text-slate-600 font-medium">{profile.industry}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Cập nhật: Hôm nay
              </span>
            </div>
          </div>
        </div>

        {/* Quick status badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trạng thái chẩn đoán
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sẵn sàng chẩn đoán</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. NÚT TO NỔI BẬT NHẤT: BẮT ĐẦU KHÁM DOANH NGHIỆP (CENTERPIECE HERO CTA) */}
      <div 
        id="hero-cta-banner"
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-500 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Chẩn đoán sức khỏe doanh nghiệp thông minh
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              BẠN ĐÃ THỰC SỰ HIỂU RÕ VỊ THẾ & ĐIỂM NGHẼN DOANH NGHIỆP?
            </h2>

            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
              CEO không cần am hiểu Canvas hay ma trận phức tạp. Chỉ cần trò chuyện 6 câu hỏi ngắn bằng giọng nói 🎙️ hoặc bấm chọn nhanh, AI sẽ tự động phân tích và xuất <strong>Bản Đồ Doanh Nghiệp</strong> chi tiết cho bạn.
            </p>

            <div className="flex items-center gap-4 text-xs text-blue-200 font-medium pt-1">
              <span>⏱️ Thời gian: 10 - 15 phút</span>
              <span>•</span>
              <span>🎙️ Hỗ trợ giọng nói tiếng Việt</span>
              <span>•</span>
              <span>📊 Xuất kết quả tức thì</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              id="start-checkup-main-btn"
              onClick={onStartCheckup}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Stethoscope className="w-5 h-5 text-slate-950" />
              <span>BẮT ĐẦU KHÁM DOANH NGHIỆP</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            {onExploreSample && (
              <button
                id="explore-sample-results-btn"
                onClick={onExploreSample}
                className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/30 text-center backdrop-blur-xs"
              >
                Xem Bản Đồ Kết Quả Mẫu &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. CARD SỨC KHỎE DOANH NGHIỆP & ĐÒN BẨY 30 NGÀY (2 CỘT NỔI BẬT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Điểm số sức khỏe (5 cols) */}
        <div 
          id="health-score-hero"
          className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                CHỈ SỐ SỨC KHỎE TỔNG THỂ
              </span>
              <button
                id="open-why-health-btn"
                onClick={() =>
                  setWhyModalData({
                    isOpen: true,
                    title: `Điểm sức khỏe ${healthScore}/100`,
                    topic: 'Chẩn đoán tổng thể doanh nghiệp',
                    dataObserved: [
                      `Doanh nghiệp: ${profile.businessName}`,
                      `Ngành: ${profile.industry}`,
                      `Quy mô: ${profile.numberOfStaff || 'Vừa và nhỏ'}`,
                      '10 trục đánh giá năng lực cạnh tranh',
                    ],
                    findings: healthSummary,
                    strategicRationale:
                      'Điểm số được tính toán dựa trên mức độ hài hòa giữa 9 ô Canvas và khả năng luân chuyển của dòng tiền từ khách hàng cũ sang khách hàng mới.',
                    confidence: 'high',
                    actionAdvice: ifOnlyOneThing.action,
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Vì sao?</span>
              </button>
            </div>

            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {/* Radial score dial */}
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">{healthScore}</span>
                  <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              <div>
                <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-100 text-blue-800 uppercase">
                  Vững chắc & Tiềm năng
                </span>
                <p className="text-xs text-slate-600 font-medium mt-1.5 leading-snug">
                  Đang hoạt động tốt ở khâu sản phẩm, nhưng bị nghẽn dòng tiền ở khâu giữ khách cũ.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-4 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              “{healthSummary}”
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('bottlenecks')}
            className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Mở Bản Đồ 5 Zone Điểm Nghẽn</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thẻ đòn bẩy: Nếu chỉ được làm 1 việc trong 30 ngày (Tone Sáng Hiện Đại Hổ Phách/Cam) */}
        <div 
          id="only-one-thing-card"
          className="lg:col-span-7 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-2xl p-6 sm:p-7 shadow-xs border-2 border-amber-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[11px] tracking-wide uppercase flex items-center gap-1 shadow-2xs">
                <Flame className="w-3.5 h-3.5" />
                HÀNH ĐỘNG ĐÒN BẨY CAO NHẤT
              </div>
              <span className="text-xs text-amber-800 font-bold">Dành riêng cho CEO</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-amber-950 tracking-tight">
              NẾU CHỈ ĐƯỢC LÀM 1 VIỆC TRONG 30 NGÀY TỚI
            </h3>

            <div className="mt-4 p-4 sm:p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs">
              <p className="text-base sm:text-lg font-black text-amber-900 leading-snug">
                👉 {ifOnlyOneThing.action}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                “Vì {ifOnlyOneThing.reason}”
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-700 font-medium">
              Giải quyết điểm nghẽn trọng tâm: <strong className="text-amber-900 font-bold">{ifOnlyOneThing.leverageBottleneck}</strong>
            </div>

            <button
              onClick={() => onNavigateToTab('action_plan')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl transition-all inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs hover:scale-[1.02]"
            >
              <span>Mở Kế Hoạch 90 Ngày</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. AI NHÌN THẤY 3 ĐIỀU QUAN TRỌNG NHẤT (DẠNG KHỐI MÀU SẮC NỔI BẬT) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-black text-slate-900">
              AI NHÌN THẤY 3 ĐIỀU QUAN TRỌNG NHẤT
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">CEO nắm bắt trong 30 giây</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 01: Điểm mạnh lớn nhất (Khối Xanh Lá Đậm) */}
          <div className="bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-2.5 py-1 rounded-md">
                  01. ĐIỂM MẠNH
                </span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-800 mt-1 mb-1">
                Lợi thế cốt lõi lớn nhất
              </div>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {threeKeyInsights.greatestStrength}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/70 text-[11px] font-semibold text-emerald-800">
              Cần bảo vệ và tiếp tục phát huy
            </div>
          </div>

          {/* 02: Điểm nghẽn lớn nhất (Khối Đỏ Hồng Cảnh Báo) */}
          <div className="bg-rose-50/80 rounded-2xl border-2 border-rose-300 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-rose-900 bg-rose-200 px-2.5 py-1 rounded-md">
                  02. ĐIỂM NGHẼN
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-rose-800 mt-1 mb-1">
                Nguyên nhân kìm hãm tăng trưởng
              </div>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {threeKeyInsights.biggestBottleneck}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-200/70 text-[11px] font-semibold text-rose-800">
              Cần ưu tiên tháo gỡ trong 30 ngày
            </div>
          </div>

          {/* 03: Cơ hội đáng chú ý nhất (Khối Vàng Cam Nổi Bật) */}
          <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-1 rounded-md">
                  03. CƠ HỘI MỚI
                </span>
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-800 mt-1 mb-1">
                Khoảng trống bứt phá doanh thu
              </div>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {threeKeyInsights.mostPromisingOpportunity}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] font-semibold text-amber-800">
              Tạo nguồn doanh thu số 2 và 3
            </div>
          </div>
        </div>
      </div>

      {/* 4. DÒNG CHẢY CHUỖI GIÁ TRỊ (BẢNG 7 BƯỚC VỚI MÀU SẮC TRỰC QUAN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              BẢN ĐỒ DÒNG CHẢY CHUỖI GIÁ TRỊ (DOANH NGHIỆP ĐANG Ở ĐÂU?)
            </h3>
            <p className="text-xs text-slate-500">
              Nhìn thấy toàn cảnh từ Thị trường đến Tăng trưởng – Nơi nào thông suốt, nơi nào rò rỉ
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('bottlenecks')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Xem chi tiết điểm nghẽn &rarr;</span>
          </button>
        </div>

        {/* 7-Step Value Stream Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
          {flowSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border-2 text-center relative transition-all shadow-2xs ${step.color}`}
            >
              <div className="text-[10px] font-black opacity-60 tracking-wider">BƯỚC {step.step}</div>
              <div className="text-xs font-black mt-0.5">{step.label}</div>
              <div className="text-[10px] mt-1 line-clamp-2 font-semibold">
                {step.note}
              </div>
              {step.status === 'danger' && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] bg-rose-600 text-white font-black animate-pulse">
                  NGHẼN
                </span>
              )}
              {step.status === 'strong' && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] bg-emerald-600 text-white font-black">
                  ĐANG MẠNH
                </span>
              )}
              {step.status === 'warning' && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] bg-amber-500 text-slate-950 font-black">
                  CHÚ Ý
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            💡 <strong>Nhận định chuyên gia:</strong> {expertFlowAssessment}
          </span>
          <button
            onClick={() => onNavigateToTab('moneyflow')}
            className="text-xs font-bold text-blue-700 shrink-0 hover:underline"
          >
            Xem Dòng Tiền &rarr;
          </button>
        </div>
      </div>

      {/* 5. KHÁM PHÁ CÁC MỤC TRONG KẾT QUẢ CHẨN ĐOÁN (ĐỂ NGƯỜI DÙNG HÌNH DUNG KẾT QUẢ) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              BẢN ĐỒ KẾT QUẢ SẼ BAO GỒM NHỮNG GÌ?
            </h3>
            <p className="text-xs text-slate-500">
              Bấm vào từng khu vực để xem trực tiếp cấu trúc kết quả chẩn đoán
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateToTab('positioning')}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              ① VỊ THẾ & KHÁC BIỆT
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Khác biệt ở đâu? Đã có bằng chứng xác thực chưa? Khách hàng có sẵn sàng trả tiền không?
            </p>
          </div>

          <div
            onClick={() => onNavigateToTab('canvas')}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <Grid className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              ② MÔ HÌNH KINH DOANH CANVAS
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              9 ô Canvas sống động với 3 lớp: Hiện trạng, Nhận xét AI và Cơ hội cải thiện.
            </p>
          </div>

          <div
            onClick={() => onNavigateToTab('bottlenecks')}
            className="bg-white rounded-2xl border-2 border-rose-200 p-5 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group bg-rose-50/20"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-700">
              ③ BẢN ĐỒ 5 ZONE ĐIỂM NGHẼN
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Vị trí rò rỉ dòng tiền và chuỗi phân tích nguyên nhân gốc rễ (Root Cause Chain).
            </p>
          </div>

          <div
            onClick={() => onNavigateToTab('moneyflow')}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              ④ DÒNG TIỀN & ĐA DÒNG TIỀN
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tiền đang vào từ đâu? Công thức mở dòng tiền thứ 2 và 3 từ tài sản sẵn có.
            </p>
          </div>

          <div
            onClick={() => onNavigateToTab('opportunities')}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              ⑤ KHOẢNG TRỐNG & CƠ HỘI
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tệp khách hàng chưa được phục vụ, sản phẩm bổ trợ và mô hình liên minh mở rộng.
            </p>
          </div>

          <div
            onClick={() => onNavigateToTab('digital_ai')}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              ⑥ SỐ HÓA & ỨNG DỤNG AI
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              3 việc AI có thể làm ngay lập tức để tiết kiệm chi phí vận hành và tăng tốc bán hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive AI Why Modal */}
      <AiWhyModal
        isOpen={whyModalData.isOpen}
        onClose={() => setWhyModalData({ ...whyModalData, isOpen: false })}
        title={whyModalData.title}
        topic={whyModalData.topic}
        dataObserved={whyModalData.dataObserved}
        findings={whyModalData.findings}
        strategicRationale={whyModalData.strategicRationale}
        confidence={whyModalData.confidence}
        actionAdvice={whyModalData.actionAdvice}
      />
    </div>
  );
};
