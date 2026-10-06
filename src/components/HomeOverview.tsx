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
  Download,
  Mail,
  Zap,
  Target,
  ArrowUpRight,
  Clock,
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

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chưa có dữ liệu chẩn đoán doanh nghiệp</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Bắt đầu buổi đối thoại 10 phút với Trợ lý AI để tự động xuất Bản đồ Điểm nghẽn và Lộ trình chiến lược 90 ngày.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={onStartCheckup}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Bắt đầu khám doanh nghiệp ngay</span>
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

  const profile = report.profile;
  const healthScore = report.healthScore ?? 72;
  const healthGrade = healthScore >= 80 ? 'A - Xuất Sắc' : healthScore >= 65 ? 'B+ - Tiềm Năng Cao' : 'C - Cần Tối Ưu Gấp';
  const scoreColor = healthScore >= 80 ? 'text-emerald-600' : healthScore >= 65 ? 'text-blue-600' : 'text-amber-600';
  const scoreBg = healthScore >= 80 ? 'bg-emerald-50 border-emerald-200' : healthScore >= 65 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';

  const ifOnlyOneThing = report.ifOnlyOneThing || {
    action: 'Tập trung kích hoạt lại tệp khách hàng cũ qua chuỗi chăm sóc tự động.',
    reason: 'Chi phí bán lại cho khách cũ thấp hơn nhiều so với tìm kiếm khách mới.',
    impact: 'Tăng ngay 20-35% doanh thu định kỳ.',
  };

  const threeKeyInsights = report.threeKeyInsights || {
    greatestStrength: `Chất lượng ${profile.coreOfferings || 'sản phẩm/dịch vụ'} và uy tín vững chắc từ tệp khách quen.`,
    biggestBottleneck: 'Chưa có hệ thống tự động để chăm sóc và tái kích hoạt khách hàng định kỳ.',
    mostPromisingOpportunity: 'Số hóa điểm chạm và đóng gói các giải pháp combo giá trị cao.',
  };

  // 5 Zones Bottlenecks Data
  const zones = [
    {
      id: 'z1',
      name: 'Thị Trường',
      status: 'An Toàn',
      statusType: 'safe',
      score: 78,
      leakRisk: 'Thấp',
      summary: 'Dung lượng thị trường còn rộng mở, uy tín thương hiệu tốt.',
    },
    {
      id: 'z2',
      name: 'Khách Hàng',
      status: 'Tiềm Năng',
      statusType: 'warning',
      score: 65,
      leakRisk: 'Trung bình',
      summary: 'Khách hài lòng nhưng tỷ lệ mua lại chưa được đo lường tự động.',
    },
    {
      id: 'z3',
      name: 'Sản Phẩm & Giá Trị',
      status: 'Điểm Mạnh',
      statusType: 'safe',
      score: 85,
      leakRisk: 'Thấp',
      summary: 'Chất lượng cốt lõi vượt trội, tỷ lệ quay lại tự nhiên cao.',
    },
    {
      id: 'z4',
      name: 'Bán Hàng & Chuyển Đổi',
      status: 'RÒ RỈ DÒNG TIỀN',
      statusType: 'danger',
      score: 48,
      leakRisk: 'CAO',
      summary: 'Phụ thuộc nhiều vào tư vấn thủ công, rò rỉ khách tiềm năng chưa chốt.',
    },
    {
      id: 'z5',
      name: 'Vận Hành & Tự Động Hóa',
      status: 'Cần Chuẩn Hóa',
      statusType: 'warning',
      score: 58,
      leakRisk: 'Trung bình',
      summary: 'Chưa có SOP số hóa, nhiều thao tác lặp lại tốn thời gian.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP EXECUTIVE BRIEFING & ACTIONS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800">
              Executive AI Cockpit 2026
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Chẩn đoán chiến lược dành riêng cho CEO
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{profile.businessName || 'Doanh Nghiệp'}</span>
            <span className="text-sm font-normal text-slate-500 hidden sm:inline">• CEO {profile.ceoName || 'Lãnh Đạo'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            💡 <strong>Màn hình tổng quan 60 giây</strong>: Tóm lược các đòn bẩy điều hành then chốt. Xem chi tiết báo cáo 10 trang bằng cách bấm nút bên phải.
          </p>
        </div>

        {/* 2 NÚT NỔI BẬT: TẢI PDF & GỬI EMAIL CHI TIẾT */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigateToTab('report')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 hover:scale-[1.01]"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Tải Báo Cáo PDF Chi Tiết (A4)</span>
          </button>

          <button
            onClick={() => onNavigateToTab('report')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 hover:scale-[1.01]"
          >
            <Mail className="w-4 h-4 text-blue-300" />
            <span>Gửi Hồ Sơ Vào Email CEO</span>
          </button>
        </div>
      </div>

      {/* 2. BỘ 4 CHỈ SỐ ĐÒN BẨY TRỌNG YẾU (EXECUTIVE SCORECARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Điểm Sức Khỏe Tổng Thể */}
        <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between ${scoreBg} shadow-2xs`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Sức Khỏe Tổng Thể</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/80 shadow-2xs text-slate-700">
              {healthGrade}
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-4xl font-black tracking-tight ${scoreColor}`}>
              {healthScore}
            </span>
            <span className="text-sm font-bold text-slate-500">/ 100 điểm</span>
          </div>
          <p className="text-xs text-slate-700 leading-snug line-clamp-2">
            {report.healthSummary || 'Nền tảng sản phẩm tốt, cần tập trung khai thông dòng tiền.'}
          </p>
        </div>

        {/* Card 2: Đòn Bẩy Số 1 Quyết Định (If Only One Thing) */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Đòn Bẩy 30 Ngày
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-200 text-amber-900">
              Ưu Tiên #1
            </span>
          </div>
          <div className="my-1.5">
            <p className="text-xs sm:text-sm font-black text-amber-950 leading-snug line-clamp-2">
              {ifOnlyOneThing.action}
            </p>
          </div>
          <p className="text-[11px] text-amber-800 font-medium line-clamp-1">
            🎯 Tác động: {ifOnlyOneThing.impact || 'Tăng ngay 20-35% doanh thu'}
          </p>
        </div>

        {/* Card 3: Điểm Nghẽn Rò Rỉ Lớn Nhất */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Rò Rỉ Dòng Tiền
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-200 text-rose-900">
              Cần Bịt Ngay
            </span>
          </div>
          <div className="my-1.5">
            <p className="text-xs sm:text-sm font-bold text-rose-950 leading-snug line-clamp-2">
              {threeKeyInsights.biggestBottleneck}
            </p>
          </div>
          <p className="text-[11px] text-rose-700 font-medium">
            ⚠️ Thất thoát khách tiềm năng sau lần mua đầu
          </p>
        </div>

        {/* Card 4: Cơ Hội Tăng Trưởng Sáng Nhất */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Cơ Hội Tăng Trưởng
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-200 text-indigo-900">
              Quy Mô Lớn
            </span>
          </div>
          <div className="my-1.5">
            <p className="text-xs sm:text-sm font-bold text-indigo-950 leading-snug line-clamp-2">
              {threeKeyInsights.mostPromisingOpportunity}
            </p>
          </div>
          <p className="text-[11px] text-indigo-700 font-medium">
            🚀 Tiềm năng nhân rộng gấp 2-3 lần
          </p>
        </div>

      </div>

      {/* 3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC (STRATEGIC TRIANGLE) - TINH GỌN, TRỰC DIỆN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Tam Giác Nhận Định Chiến Lược Cho CEO
            </h2>
          </div>
          <button
            onClick={() =>
              setWhyModalData({
                isOpen: true,
                title: 'Tại Sao Lại Ra Quyết Định Này?',
                topic: 'Phương pháp luận TOC & Chiến Lược Đòn Bẩy',
                dataObserved: [
                  `Khảo sát ngành ${profile.industry || 'Kinh doanh'}`,
                  `Điểm sức khỏe: ${healthScore}/100`,
                  `Hiện trạng đội ngũ: ${profile.numberOfStaff || 'Dưới 20 nhân sự'}`,
                ],
                findings: 'Doanh nghiệp có lợi thế sản phẩm vững chắc nhưng quy trình tiếp cận và kích hoạt mua lại còn làm thủ công, dẫn đến lãng phí chi phí marketing.',
                strategicRationale: 'Áp dụng Lý thuyết Điểm nghẽn (Theory of Constraints): Thay vì dàn trải nguồn lực, chỉ cần gỡ đúng nút thắt tái kích hoạt khách hàng thì doanh thu sẽ tự động tăng.',
                confidence: 'high',
                actionAdvice: ifOnlyOneThing.action,
              })
            }
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tại sao AI đề xuất việc này?</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Cột 1: Sức mạnh cốt lõi */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>01. Sức Mạnh Cốt Lõi</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
              {threeKeyInsights.greatestStrength}
            </p>
            <div className="text-[11px] text-emerald-700">
              → Điểm tựa vững chắc để giữ chân khách hàng và nhân bản.
            </div>
          </div>

          {/* Cột 2: Điểm nghẽn rò rỉ */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>02. Điểm Nghẽn Rò Rỉ</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-rose-950 leading-relaxed">
              {threeKeyInsights.biggestBottleneck}
            </p>
            <div className="text-[11px] text-rose-700">
              → Lỗ hổng cần bịt ngay trước khi chi thêm tiền quảng cáo.
            </div>
          </div>

          {/* Cột 3: Cơ hội bứt phá */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-blue-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>03. Cơ Hội Bứt Phá</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-blue-950 leading-relaxed">
              {threeKeyInsights.mostPromisingOpportunity}
            </p>
            <div className="text-[11px] text-blue-700">
              → Đòn bẩy mở rộng quy mô với chi phí đầu tư tối thiểu.
            </div>
          </div>
        </div>
      </div>

      {/* 4. BẢN ĐỒ 5 ZONE ĐIỂM NGHẼN (HEATMAP DÒNG TIỀN) - RÕ RÀNG, BẮT MẮT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Bản Đồ 5 Zone Dòng Tiền &amp; Điểm Nghẽn Vận Hành</span>
            </h2>
            <p className="text-xs text-slate-500">
              Định vị chính xác mắt xích nào đang hoạt động tốt và mắt xích nào đang làm rò rỉ doanh số.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('bottlenecks')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>Xem chi tiết 5 Zone</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {zones.map((z, idx) => (
            <div
              key={z.id}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all hover:shadow-xs ${
                z.statusType === 'danger'
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : z.statusType === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-slate-50/80 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500">0{idx + 1}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-black ${
                      z.statusType === 'danger'
                        ? 'bg-rose-200 text-rose-900'
                        : z.statusType === 'warning'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {z.status}
                  </span>
                </div>
                <div className="text-xs font-black tracking-tight mb-1">{z.name}</div>
                <p className="text-[11px] leading-snug text-slate-600 line-clamp-2">
                  {z.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500">Chỉ số: {z.score}%</span>
                <span className={z.statusType === 'danger' ? 'text-rose-700' : 'text-slate-600'}>
                  Rủi ro: {z.leakRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. LỘ TRÌNH 90 NGÀY CỦA CEO (3 BƯỚC HÀNH ĐỘNG CÔ ĐỌNG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Lộ Trình 90 Ngày Hành Động Của CEO (3 Mốc Quyết Định)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Tập trung giải quyết dứt điểm theo từng giai đoạn, không dàn trải bộ máy.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('action_plan')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>Xem danh sách việc chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Giai đoạn 1 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-200 text-blue-900">
                THÁNG 1 (NGÀY 1 - 30)
              </span>
              <span className="text-[10px] font-bold text-blue-700">Khóa Lỗ Rò Rỉ</span>
            </div>
            <div className="text-xs font-black text-slate-900">
              Bịt rò rỉ dòng tiền &amp; Tái kích hoạt khách hàng cũ
            </div>
            <p className="text-[11px] text-slate-600">
              Khai thác tệp khách hàng quen qua tin nhắn tự động; chuẩn hóa kịch bản chốt đơn nhanh.
            </p>
            <div className="pt-1.5 border-t border-blue-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KPI: Tăng ngay 15% tỷ lệ mua lại</span>
            </div>
          </div>

          {/* Giai đoạn 2 */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-200 text-indigo-900">
                THÁNG 2 (NGÀY 31 - 60)
              </span>
              <span className="text-[10px] font-bold text-indigo-700">Đóng Gói &amp; SOP</span>
            </div>
            <div className="text-xs font-black text-slate-900">
              Chuẩn hóa quy trình vận hành và ứng dụng AI tự động hóa
            </div>
            <p className="text-[11px] text-slate-600">
              Xây dựng trợ lý AI hỗ trợ tư vấn bán hàng 24/7; giảm 50% sự phụ thuộc trực tiếp vào CEO.
            </p>
            <div className="pt-1.5 border-t border-indigo-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KPI: Giảm 30% thời gian xử lý đơn</span>
            </div>
          </div>

          {/* Giai đoạn 3 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-200 text-emerald-900">
                THÁNG 3 (NGÀY 61 - 90)
              </span>
              <span className="text-[10px] font-bold text-emerald-700">Bứt Phá Quy Mô</span>
            </div>
            <div className="text-xs font-black text-slate-900">
              Mở rộng kênh tiếp cận và bứt phá doanh số quý
            </div>
            <p className="text-[11px] text-slate-600">
              Triển khai các gói combo giải pháp trọn gói và thiết lập mạng lưới đối tác giới thiệu khách.
            </p>
            <div className="pt-1.5 border-t border-emerald-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KPI: Đạt mốc tăng trưởng doanh số quý</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. LỐI TẮT KHÁM PHÁ NHANH CÁC CHUYÊN MỤC SÂU */}
      <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-slate-600">
            Khám Phá Chi Tiết Từng Khía Cạnh (1-Click)
          </div>
          <span className="text-[11px] text-slate-500">9 Chuyên Mục Chẩn Đoán</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: 'positioning', label: '02. Vị Thế', icon: Compass },
            { id: 'canvas', label: '03. Canvas 9 Ô', icon: Grid },
            { id: 'bottlenecks', label: '04. 5 Zone Nghẽn', icon: AlertTriangle },
            { id: 'moneyflow', label: '05. Dòng Tiền', icon: Coins },
            { id: 'digital_ai', label: '07. Số Hóa & AI', icon: Cpu },
            { id: 'action_plan', label: '08. Kế Hoạch 90N', icon: Calendar },
            { id: 'report', label: '09. Báo Cáo CEO', icon: Download, highlight: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateToTab(item.id)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  item.highlight
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs hover:bg-blue-700'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${item.highlight ? 'text-white' : 'text-blue-600'}`} />
                <span className="text-xs font-bold leading-tight line-clamp-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Why Modal */}
      {whyModalData.isOpen && (
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
      )}

    </div>
  );
};
