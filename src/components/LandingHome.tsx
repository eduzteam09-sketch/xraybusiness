import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Coins,
  Lightbulb,
  FileSpreadsheet,
  CheckCircle2,
  Mic,
  Clock,
  Download,
  Mail,
  Building2,
  Eye,
  Check,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  ChevronRight,
  HelpCircle,
  Users,
  Award,
} from 'lucide-react';

interface LandingHomeProps {
  onStartCheckup: () => void;
  onExploreSample: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onStartCheckup,
  onExploreSample,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-2 px-4 text-center text-xs font-semibold shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[10px] tracking-wider uppercase backdrop-blur-xs">
            Mới 2026
          </span>
          <span>Nền tảng AI chẩn đoán sức khỏe &amp; định vị chiến lược độc lập cho SME Việt Nam</span>
          <span className="hidden md:inline text-blue-200">•</span>
          <span className="hidden md:inline text-amber-300 font-bold">Không cần đăng nhập • Miễn phí 100%</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-16 sm:space-y-24">
        {/* 2. HERO SECTION - TỐI GIẢN CHỮ, TẬP TRUNG THỊ GIÁC & HÀNH ĐỘNG */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Subtle Live Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-blue-200 text-blue-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chẩn Đoán Trực Quan • Chuẩn Hóa Theo Canvas &amp; TOC</span>
          </div>

          {/* Main Headline - Mạnh mẽ, súc tích, trực diện */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Biết Doanh Nghiệp Đang Ở Đâu.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-1">
              Thấy Rõ Điểm Nghẽn Dòng Tiền.
            </span>
          </h1>

          {/* Subheading - Tinh gọn, không dài dòng */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Không lý thuyết quản trị phức tạp. Chỉ cần <strong className="text-slate-900 font-semibold">10 phút</strong> trò chuyện bằng giọng nói 🎙️, AI sẽ tự động xuất <strong className="text-blue-700 font-semibold">Bản Đồ Điểm Nghẽn</strong> và <strong className="text-slate-900 font-semibold">Lộ Trình 90 Ngày</strong> để bứt phá doanh thu.
          </p>

          {/* Primary Action Buttons (2 Nút Nổi Bật) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="landing-hero-start-btn"
              onClick={onStartCheckup}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-5 h-5 text-white" />
              <span>BẮT ĐẦU KHÁM DOANH NGHIỆP</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <button
              id="landing-hero-sample-btn"
              onClick={onExploreSample}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-2xl transition-all border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01]"
            >
              <Eye className="w-5 h-5 text-blue-600" />
              <span>Xem Bản Đồ Kết Quả Mẫu</span>
            </button>
          </div>

          {/* Micro Trust Proofs */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 pt-2 flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              Không cần đăng ký
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-blue-600 shrink-0" />
              Giọng nói tiếng Việt
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-slate-600 shrink-0" />
              Tải PDF &amp; Email tự động
            </span>
          </div>
        </div>

        {/* 2.5. HERO VISUAL SHOWCASE BANNER - HÌNH ẢNH & INFOGRAPHIC TRỰC QUAN */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-10">
          {/* Background strategic image with overlay */}
          <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80"
              alt="Business Strategy Architecture"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Decorative glowing gradient orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Content */}
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  INFOGRAPHIC TIẾN TRÌNH KHÁM TỰ ĐỘNG
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Từ Trò Chuyện Giọng Nói Đến Bản Đồ Chiến Lược Thực Thụ
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Hệ thống phân tích chuẩn xác theo đúng thực trạng dữ liệu CEO cung cấp, loại bỏ hoàn toàn các nhận định sáo rỗng.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Dữ Liệu Thật 100%
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  Đo Lường TOC
                </span>
              </div>
            </div>

            {/* 4-Step Infographic Flow Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:border-blue-400/40 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-300 font-black text-xs flex items-center justify-center border border-blue-400/30">
                    01
                  </span>
                  <Mic className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Khám Bằng Giọng Nói</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CEO chia sẻ tự nhiên về tệp khách hàng thật, mô hình liên kết, tỷ lệ chia sẻ và sản phẩm cốt lõi.
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-blue-200 font-semibold">
                  🎙️ Nhận diện ngữ nghĩa tiếng Việt
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:border-indigo-400/40 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-400/30">
                    02
                  </span>
                  <Layers className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Mô Hình 9 Ô Canvas Sống</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tự động điền 9 thành phần phản ánh đúng khách hàng mục tiêu, đối tác chia sẻ và các nguồn doanh thu.
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-indigo-200 font-semibold">
                  📊 3 Tầng: Hiện tại • Phản biện • Cơ hội
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:border-amber-400/40 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-400/30">
                    03
                  </span>
                  <Coins className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Dò Rò Rỉ Dòng Tiền</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bóc tách nguyên nhân gốc rễ (5-Why TOC) khiến doanh số bấp bênh hoặc thiếu cơ chế mua lại định kỳ.
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-amber-200 font-semibold">
                  💰 Dòng tiền hiện tại vs Dòng tiền mới
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:border-emerald-400/40 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-400/30">
                    04
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Lộ Trình 90 Ngày Rõ Ràng</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Biến chiến lược thành 3 ưu tiên tuần tự với KPI đo lường được, có thể bàn giao ngay cho đội ngũ.
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-emerald-200 font-semibold">
                  🚀 Ưu tiên 01: 0 - 30 ngày làm ngay
                </div>
              </div>
            </div>

            {/* Banner Footer Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Ứng dụng Engine suy luận chiến lược chuyên sâu • Không cần cài đặt phần mềm</span>
              </div>
              <button
                onClick={onStartCheckup}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <span>Trải nghiệm ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE BENTO PREVIEW: BẢN ĐỒ DOANH NGHIỆP SẼ NHƯ THẾ NÀO? (SHOWCASE VISUAL) */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="text-[11px] font-black uppercase tracking-widest text-blue-700">
              TRỰC QUAN HÓA KẾT QUẢ
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bản Đồ Chiến Lược Bạn Sẽ Nhận Được
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Nhìn thấy toàn cảnh sức khỏe doanh nghiệp chỉ sau một lần chẩn đoán
            </p>
          </div>

          {/* Bento Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Box 1: Điểm Sức Khỏe Radar (Col 5) */}
            <div 
              onClick={onExploreSample}
              className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                    Sức Khỏe Doanh Nghiệp
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-blue-600 flex items-center gap-1 font-semibold">
                    Xem mẫu &rarr;
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col items-center justify-center text-blue-700">
                    <span className="text-3xl font-black leading-none">68</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">/ 100</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Vững chắc &amp; Tiềm năng</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sản phẩm tốt nhưng đang rò rỉ dòng tiền ở khâu giữ chân khách hàng cũ.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 mini bars */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-600">Sản phẩm &amp; Chất lượng</span>
                    <span className="text-blue-700 font-bold">4.2/5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-[84%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-600">Dòng tiền &amp; Mua lại</span>
                    <span className="text-rose-600 font-bold">2.1/5 (Rò rỉ)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full w-[42%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Hành Động Đòn Bẩy 30 Ngày (Col 7) */}
            <div 
              onClick={onExploreSample}
              className="md:col-span-7 bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-3xl p-6 border-2 border-amber-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                    ⚡ Đòn Bẩy Cao Nhất (Luật 80/20)
                  </span>
                  <span className="text-xs text-amber-800 group-hover:text-amber-950 flex items-center gap-1 font-bold">
                    Khám phá &rarr;
                  </span>
                </div>

                <h3 className="text-lg font-black text-amber-950 mt-1 leading-snug">
                  Nếu chỉ được làm 1 việc trong 30 ngày tới:
                </h3>

                <div className="mt-3 p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs">
                  <div className="text-sm sm:text-base font-bold text-amber-900">
                    👉 Kích hoạt quy trình Chăm sóc khách cũ qua Zalo OA &amp; Combo VIP
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    “Giúp chặn ngay rò rỉ 30% doanh thu mà không cần chi thêm 1 đồng ngân sách quảng cáo mới.”
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-medium">
                <span>Giải quyết điểm nghẽn: <strong>Giữ chân khách hàng</strong></span>
                <span className="font-bold underline">Xem chi tiết lộ trình</span>
              </div>
            </div>

            {/* Box 3: 5 Zone Điểm Nghẽn (Col 8) */}
            <div 
              onClick={onExploreSample}
              className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Bản Đồ 5 Zone Dòng Chảy
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600 flex items-center gap-1 font-semibold">
                  Xem 5-Why &rarr;
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-2">
                Định vị điểm tiền bị rơi rụng trong chuỗi vận hành
              </h3>

              {/* 5-Step Visual Pipeline */}
              <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                  <div className="text-[9px] text-emerald-600 uppercase">Zone 1</div>
                  <div className="mt-1">Thị trường</div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-emerald-200 rounded text-emerald-800">Tốt</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                  <div className="text-[9px] text-emerald-600 uppercase">Zone 2</div>
                  <div className="mt-1">Tiếp cận</div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-emerald-200 rounded text-emerald-800">Ổn định</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                  <div className="text-[9px] text-amber-600 uppercase">Zone 3</div>
                  <div className="mt-1">Chốt đơn</div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-amber-200 rounded text-amber-800">Trung bình</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-bold ring-2 ring-rose-200/50">
                  <div className="text-[9px] text-rose-600 uppercase font-black">Zone 4</div>
                  <div className="mt-1">Giữ chân</div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-rose-600 text-white rounded font-black">NGHẼN</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold">
                  <div className="text-[9px] text-slate-400 uppercase">Zone 5</div>
                  <div className="mt-1">Mua lại</div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-slate-200 rounded text-slate-600">Thấp</span>
                </div>
              </div>
            </div>

            {/* Box 4: Xuất PDF & Gửi Email Tự Động (Col 4) */}
            <div 
              onClick={onExploreSample}
              className="md:col-span-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-black uppercase text-blue-200 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  Executive Export
                </span>
                <h3 className="text-lg font-black text-white mt-3 leading-snug">
                  Báo Cáo 1 Trang Chuẩn Cho Ban Lãnh Đạo
                </h3>
                <p className="text-xs text-blue-100 mt-2 leading-relaxed">
                  Xuất file PDF chất lượng cao, tự động gửi về Email cá nhân kèm tệp đính kèm.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Sẵn sàng in ấn</span>
                </span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 4 TRỤ CỘT GIÁ TRỊ THỰC TIỄN (THAY CHO ĐỐNG CHỮ DÀI DÒNG) */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Bài Toán Sống Còn Được Giải Quyết Tức Thì
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Tập trung vào kết quả kinh doanh thực tế, không lý thuyết chung chung
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cột 1 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">
                Bịt Kín Rò Rỉ Dòng Tiền
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biết chính xác tiền rơi rụng ở khâu nào và bóc tách chuỗi nguyên nhân gốc rễ (5-Why).
              </p>
            </div>

            {/* Cột 2 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">
                1 Việc Đòn Bẩy Cao Nhất
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Không bị ngợp bởi 100 đầu việc. AI chỉ ra đúng 1 hành động 80/20 tạo đột phá trong 30 ngày.
              </p>
            </div>

            {/* Cột 3 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">
                Khai Phá Đa Dòng Tiền
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mở thêm nguồn doanh thu số 2 &amp; 3 từ tệp khách cũ và đối tác mà không cần thêm vốn lớn.
              </p>
            </div>

            {/* Cột 4 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">
                Kế Hoạch 90 Ngày Rõ Ràng
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lộ trình 3 giai đoạn chia nhỏ mục tiêu, có KPI đo lường cụ thể cho đội ngũ thực thi.
              </p>
            </div>
          </div>
        </div>

        {/* 5. TIẾN TRÌNH 3 BƯỚC KHÁM CỰC KỲ ĐƠN GIẢN (VISUAL STEPPER) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-700">
              TRẢI NGHIỆM ĐƠN GIẢN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              3 Bước Nhận Bản Đồ Chiến Lược
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              CEO không cần chuẩn bị tài liệu phức tạp, chỉ cần trò chuyện tự nhiên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Bước 1 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Trò chuyện 6 câu hỏi đời thường</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nói bằng giọng nói 🎙️ hoặc bấm chọn nhanh các phương án gợi ý về khách hàng, sản phẩm, doanh thu và vận hành.
              </p>
              <div className="text-[11px] font-bold text-blue-700">⏱️ Mất khoảng 10 - 15 phút</div>
            </div>

            {/* Bước 2 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">9 Engine AI phân tích đa tầng</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự động bóc tách Canvas sống 3 lớp, dò tìm 5 Zone điểm nghẽn và đo lường 10 trục năng lực cạnh tranh.
              </p>
              <div className="text-[11px] font-bold text-indigo-700">⚡ Xử lý tức thì trong 3 giây</div>
            </div>

            {/* Bước 3 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Nhận Bản Đồ &amp; Lộ Trình Thực Thi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Xem trực tiếp trên màn hình, tải file PDF chuẩn Executive hoặc nhận email tự động có đính kèm file báo cáo.
              </p>
              <div className="text-[11px] font-bold text-emerald-700">📊 Tải PDF &amp; Lưu trữ vĩnh viễn</div>
            </div>
          </div>
        </div>

        {/* 6. BẢNG SO SÁNH: TRƯỚC VÀ SAU KHI SỬ DỤNG AI CHECK-UP */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sự Khác Biệt Cho Lãnh Đạo
            </h2>
            <p className="text-xs text-slate-500">
              Tại sao hàng trăm chủ doanh nghiệp chọn giải pháp AI khám sức khỏe độc lập
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Cách cũ */}
            <div className="p-5 rounded-3xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="font-black text-rose-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Cách Tư Vấn Truyền Thống</span>
              </div>
              <ul className="space-y-2.5 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Chi phí tư vấn từ 50 - 200 triệu đồng, thời gian kéo dài nhiều tuần lễ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Báo cáo dài 50-100 trang toàn thuật ngữ hàn lâm khó hiểu, cuối cùng cất ngăn kéo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>CEO bị quá tải vì liệt kê ra quá nhiều việc cần sửa mà không biết bắt đầu từ đâu.</span>
                </li>
              </ul>
            </div>

            {/* Với AI Check-up */}
            <div className="p-5 rounded-3xl bg-emerald-50/60 border-2 border-emerald-300 space-y-3 shadow-2xs">
              <div className="font-black text-emerald-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Với AI Business Health Check</span>
              </div>
              <ul className="space-y-2.5 text-slate-900 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Miễn phí 100%</strong>, hoàn thành trong 10-15 phút trò chuyện giọng nói.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Bản đồ trực quan 1 trang Executive Summary, CEO nắm bắt toàn diện trong 30 giây.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Chỉ ra <strong>đúng 1 việc đòn bẩy cao nhất</strong> trong 30 ngày để tập trung nguồn lực.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 7. FAQ ACCORDION GỌN GÀNG DÀNH CHO CEO */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Câu Hỏi Thường Gặp Của CEO
            </h2>
            <p className="text-xs text-slate-500">
              Giải đáp nhanh các thắc mắc phổ biến nhất
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                q: 'Tôi không rành công nghệ và không biết Canvas có dùng được không?',
                a: 'Hoàn toàn được! Bạn không cần biết bất kỳ thuật ngữ nào. Bạn chỉ cần trả lời 6 câu hỏi đời thường như đang tâm sự với người bạn đồng hành, AI sẽ tự động phân tích và chuyển hóa vào mô hình cho bạn.',
              },
              {
                q: 'Ứng dụng có yêu cầu mật khẩu hay đăng ký tài khoản không?',
                a: 'Không. Ứng dụng hoạt động ngay lập tức không cần đăng ký tài khoản, không yêu cầu thẻ tín dụng. Mọi dữ liệu phân tích được lưu trữ an toàn trên thiết bị của bạn.',
              },
              {
                q: 'Làm thế nào để tải file PDF và nhận báo cáo qua email?',
                a: 'Sau khi hoàn thành khám (hoặc khi xem kết quả mẫu), bạn chỉ cần vào mục "Báo Cáo CEO" và bấm "Tải File PDF" hoặc nhập email để hệ thống tự động gửi trực tiếp về hòm thư của bạn.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left font-bold text-slate-900 flex items-center justify-between gap-2 hover:text-blue-600 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <span className="text-slate-400 font-normal text-base shrink-0">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-slate-600 leading-relaxed font-normal animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. BOTTOM HERO CTA - KÊU GỌI HÀNH ĐỘNG CUỐI TRANG */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden space-y-5">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs inline-block">
              Sẵn Sàng Tăng Trưởng
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Định Vị &amp; Khám Sức Khỏe Doanh Nghiệp Ngay Hôm Nay
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-normal leading-relaxed">
              10 phút hôm nay có thể giúp doanh nghiệp của bạn tiết kiệm hàng trăm triệu đồng rò rỉ và tìm ra hướng tăng trưởng bứt phá trong 90 ngày tới.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="landing-bottom-start-btn"
              onClick={onStartCheckup}
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-5 h-5 text-slate-950" />
              <span>BẮT ĐẦU KHÁM NGAY (MIỄN PHÍ)</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            <button
              id="landing-bottom-sample-btn"
              onClick={onExploreSample}
              className="w-full sm:w-auto px-6 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base rounded-2xl transition-all border border-white/30 backdrop-blur-xs"
            >
              Xem Bản Đồ Mẫu &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
