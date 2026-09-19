import React, { useState } from 'react';
import {
  Grid,
  Users,
  Award,
  Radio,
  HeartHandshake,
  Coins,
  Package,
  Activity,
  Network,
  CreditCard,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { Canvas9Model, CanvasItem } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface CanvasLivingProps {
  canvas: Canvas9Model;
  businessName: string;
}

export const CanvasLiving: React.FC<CanvasLivingProps> = ({ canvas, businessName }) => {
  const [viewMode, setViewMode] = useState<'infographic' | 'grid'>('infographic');
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'current' | 'feedback' | 'opportunity'>('all');
  const [modalData, setModalData] = useState<{
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

  const openWhyModal = (item: CanvasItem) => {
    setModalData({
      isOpen: true,
      title: `${item.title} (${item.englishSub})`,
      topic: `Phân tích mô hình kinh doanh Canvas - ${businessName}`,
      dataObserved: item.current,
      findings: item.aiFeedback,
      strategicRationale: `Dựa trên dữ liệu vận hành thực tế, thành phần này quyết định trực tiếp tới khả năng chuyển hóa giá trị thành dòng tiền mặt.`,
      confidence: 'high',
      actionAdvice: item.opportunity,
    });
  };

  const renderCard = (
    item: CanvasItem,
    icon: React.ReactNode,
    colorClass: string,
    gridClass: string,
    badgeText?: string
  ) => {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-200/80 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-300 transition-all ${gridClass}`}
      >
        <div>
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass} shrink-0`}>
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                  {badgeText && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                      {badgeText}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{item.englishSub}</span>
              </div>
            </div>

            <button
              onClick={() => openWhyModal(item)}
              title="Xem giải thích AI chi tiết"
              className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Layer 1: HIỆN TẠI */}
          {(selectedLayer === 'all' || selectedLayer === 'current') && (
            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Thực tế đang có:
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {item.current.length} ý chính
                </span>
              </div>
              <ul className="space-y-1.5">
                {item.current.map((c, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-1.5 bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Layer 2: AI PHẢN BIỆN */}
          {(selectedLayer === 'all' || selectedLayer === 'feedback') && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
              <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                AI Phản biện & Đánh giá:
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {item.aiFeedback}
              </p>
            </div>
          )}

          {/* Layer 3: CƠ HỘI NÂNG CẤP */}
          {(selectedLayer === 'all' || selectedLayer === 'opportunity') && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
              <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Cơ hội cải thiện:
              </div>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">
                {item.opportunity}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => openWhyModal(item)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>Chi tiết & Lập luận</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20 font-sans">
      {/* 1. Header & Navigation Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Grid className="w-3.5 h-3.5" />
              Mô Hình Kinh Doanh Sống (Living Canvas)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
              BẢN ĐỒ 9 THÀNH PHẦN KINH DOANH
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Phản ánh 100% đúng dữ liệu thực tế của <strong>{businessName}</strong>. Hệ thống bóc tách rõ khách hàng cốt lõi, cơ chế đối tác chia sẻ và các dòng doanh thu thực tiễn.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                id="btn-view-infographic"
                onClick={() => setViewMode('infographic')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'infographic'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Infographic Trực Quan</span>
              </button>
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Lưới 9 Ô Chuẩn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Layers for Grid View */}
        {viewMode === 'grid' && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-500 font-semibold">Bộ lọc tầng thông tin:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedLayer('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedLayer === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả 3 tầng
              </button>
              <button
                onClick={() => setSelectedLayer('current')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedLayer === 'current'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Chỉ xem Thực tế hiện tại
              </button>
              <button
                onClick={() => setSelectedLayer('feedback')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedLayer === 'feedback'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Chỉ xem AI Phản biện
              </button>
              <button
                onClick={() => setSelectedLayer('opportunity')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedLayer === 'opportunity'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                Chỉ xem Cơ hội cải thiện
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. INFOGRAPHIC VIEW: LUỒNG GIÁ TRỊ & DÒNG TIỀN TRỰC QUAN */}
      {viewMode === 'infographic' && (
        <div className="space-y-6">
          {/* 3 Pillars Overview Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pillar 1: VẬN HÀNH & HẬU CẦN */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-3xl p-5 border border-purple-200/70 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200">
                    Trụ Cột 01: Hậu Cần & Đòn Bẩy
                  </span>
                  <Network className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Cơ Chế Đối Tác & Nguồn Lực</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Cách tổ chức mặt bằng, thiết bị và đội ngũ thực thi để vận hành trơn tru mà không chịu gánh nặng chi phí cố định quá lớn.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-1">🤝 Đối tác trọng tâm:</span>
                    <span className="text-slate-700">{canvas.keyPartners.current[0] || 'Đối tác chiến lược'}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-1">⚡ Hoạt động then chốt:</span>
                    <span className="text-slate-700">{canvas.keyActivities.current[0] || 'Hoạt động cung ứng'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs text-purple-800 font-semibold">
                <span>Năng lực vận hành:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-200/60 font-black">Vững chắc</span>
              </div>
            </div>

            {/* Pillar 2: GIÁ TRỊ CỐT LÕI (TRUNG TÂM) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full border border-amber-300">
                    Trụ Cột 02: Trọng Tâm Giá Trị (USP)
                  </span>
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Định Vị & Lời Cam Kết</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Lý do khách hàng quyết định chi trả và lựa chọn bạn thay vì đối thủ cạnh tranh trên thị trường.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-2xs">
                    <span className="font-bold text-amber-900 block mb-1">⭐ Giá trị mang lại:</span>
                    <span className="text-slate-800 font-medium leading-relaxed">
                      {canvas.valuePropositions.current[0] || 'Giải pháp chất lượng cao cam kết'}
                    </span>
                  </div>
                  <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-200 text-amber-950 font-medium">
                    <span className="font-bold block text-amber-900 mb-0.5">💡 Cơ hội bứt phá:</span>
                    {canvas.valuePropositions.opportunity}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900 font-semibold">
                <span>Điểm khác biệt độc nhất:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-200 font-black">Ưu thế lớn</span>
              </div>
            </div>

            {/* Pillar 3: KHÁCH HÀNG & THỊ TRƯỜNG */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                    Trụ Cột 03: Khách Hàng & Thị Trường
                  </span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Khách Hàng & Điểm Chạm</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Đối tượng thụ hưởng trực tiếp và người ra quyết định chi trả, cùng các kênh tiếp cận có chi phí chuyển đổi thấp nhất.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">🎯 Khách hàng chính:</span>
                    <span className="text-slate-700">{canvas.customerSegments.current[0] || 'Khách hàng cốt lõi'}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">📢 Kênh tiếp cận:</span>
                    <span className="text-slate-700">{canvas.channels.current[0] || 'Kênh trực tiếp'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Mức độ tập trung tệp:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 font-black">Rất cao</span>
              </div>
            </div>
          </div>

          {/* Interactive Financial Balancing Infographic */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  CÂN BẰNG TÀI CHÍNH MÔ HÌNH
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">Cơ Cấu Chi Phí vs Các Dòng Doanh Thu</h4>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Doanh thu đang nuôi dưỡng bộ máy vận hành</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost side */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    Cơ Cấu Chi Phí (Cost Structure)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Chi Phí</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {canvas.costStructure.current.map((cost, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{cost}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] text-slate-500 bg-white/60 p-2 rounded-lg border border-slate-200/50">
                  <strong className="text-slate-700">Tối ưu chi phí:</strong> {canvas.costStructure.opportunity}
                </div>
              </div>

              {/* Revenue side */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    Dòng Doanh Thu (Revenue Streams)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">Dòng Tiền</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {canvas.revenueStreams.current.map((rev, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-emerald-200/80 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{rev}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] text-emerald-900 bg-emerald-100/50 p-2 rounded-lg border border-emerald-200">
                  <strong className="text-emerald-950">Cơ hội dòng tiền mới:</strong> {canvas.revenueStreams.opportunity}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRID VIEW: 9-BOX BUSINESS MODEL CANVAS CHUẨN QUỐC TẾ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Col 1: Key Partners */}
          {renderCard(
            canvas.keyPartners,
            <Network className="w-4 h-4 text-purple-600" />,
            'bg-purple-50',
            'lg:col-span-1',
            'Đòn Bẩy Đối Tác'
          )}

          {/* Col 2: Key Activities + Key Resources */}
          <div className="lg:col-span-1 space-y-4 flex flex-col">
            {renderCard(
              canvas.keyActivities,
              <Activity className="w-4 h-4 text-blue-600" />,
              'bg-blue-50',
              'flex-1',
              'Vận Hành'
            )}
            {renderCard(
              canvas.keyResources,
              <Package className="w-4 h-4 text-indigo-600" />,
              'bg-indigo-50',
              'flex-1',
              'Tài Sản Cốt Lõi'
            )}
          </div>

          {/* Col 3: Value Proposition (Center) */}
          {renderCard(
            canvas.valuePropositions,
            <Award className="w-4 h-4 text-amber-600" />,
            'bg-amber-50',
            'lg:col-span-1 border-blue-300 ring-2 ring-blue-500/10 shadow-sm',
            'Trọng Tâm USP'
          )}

          {/* Col 4: Customer Relationships + Channels */}
          <div className="lg:col-span-1 space-y-4 flex flex-col">
            {renderCard(
              canvas.customerRelationships,
              <HeartHandshake className="w-4 h-4 text-rose-600" />,
              'bg-rose-50',
              'flex-1',
              'Giữ Chân'
            )}
            {renderCard(
              canvas.channels,
              <Radio className="w-4 h-4 text-cyan-600" />,
              'bg-cyan-50',
              'flex-1',
              'Kênh Tiếp Cận'
            )}
          </div>

          {/* Col 5: Customer Segments */}
          {renderCard(
            canvas.customerSegments,
            <Users className="w-4 h-4 text-emerald-600" />,
            'bg-emerald-50',
            'lg:col-span-1',
            'Thị Trường & Khách'
          )}

          {/* Bottom Row: Cost Structure & Revenue Streams */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {renderCard(
              canvas.costStructure,
              <CreditCard className="w-4 h-4 text-slate-600" />,
              'bg-slate-100',
              '',
              'Chi Phí'
            )}
            {renderCard(
              canvas.revenueStreams,
              <Coins className="w-4 h-4 text-emerald-600" />,
              'bg-emerald-50',
              '',
              'Doanh Thu'
            )}
          </div>
        </div>
      )}

      {/* Footnote about Canvas value */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Ghi chú chiến lược:</strong> Bản đồ Canvas này kết nối trực tiếp với 7 bước chuỗi giá trị và dòng tiền của doanh nghiệp. Nhấp vào nút <strong>&quot;Chi tiết &amp; Lập luận&quot;</strong> ở bất kỳ thành phần nào để xem suy luận và số liệu kiểm chứng của AI.
        </div>
      </div>

      {/* Ai Why Modal */}
      <AiWhyModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        topic={modalData.topic}
        dataObserved={modalData.dataObserved}
        findings={modalData.findings}
        strategicRationale={modalData.strategicRationale}
        confidence={modalData.confidence}
        actionAdvice={modalData.actionAdvice}
      />
    </div>
  );
};
