import React from 'react';
import {
  Stethoscope,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  Check,
  Mic,
  Download,
  Mail,
  Layers,
  Coins,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface LandingHomeProps {
  onStartCheckup: () => void;
  onExploreSample: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onStartCheckup,
  onExploreSample,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP ANNOUNCEMENT BAR - TINH GỌN */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white py-2 px-4 text-center text-xs font-bold shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[10px] uppercase">
            AI-FIRST 2026
          </span>
          <span>Hệ thống chẩn đoán sức khỏe &amp; định vị chiến lược 90 ngày cho CEO</span>
          <span className="hidden sm:inline text-blue-200">•</span>
          <span className="hidden sm:inline text-amber-300">Không cần đăng nhập • Trực quan hóa 100%</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        
        {/* 2. HERO SECTION - TỐI GIẢN CHỮ, ĐÒN BẨY HÀNH ĐỘNG MẠNH MẼ */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chuẩn Hóa Theo Phương Pháp Luận TOC &amp; Strategy Canvas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Biết Doanh Nghiệp Đang Ở Đâu.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-1">
              Bịt Kín Rò Rỉ Dòng Tiền.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Không lý thuyết quản trị phức tạp. Trò chuyện <strong className="text-slate-900">10 phút bằng giọng nói</strong> 🎙️, AI tự động xuất <strong className="text-blue-700">Bản Đồ 5 Zone Điểm Nghẽn</strong> và <strong className="text-slate-900">Lộ Trình 90 Ngày</strong> có KPI đo lường.
          </p>

          {/* 2 NÚT HÀNH ĐỘNG CHÍNH */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="landing-hero-start-btn"
              onClick={onStartCheckup}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>BẮT ĐẦU KHÁM DOANH NGHIỆP</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              id="landing-hero-sample-btn"
              onClick={onExploreSample}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl transition-all border border-slate-300 hover:border-slate-400 flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01]"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Xem Bản Đồ Kết Quả Mẫu (CEO Cockpit)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs text-slate-500 pt-1 font-medium flex-wrap">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Miễn phí 100%
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-blue-600" />
              Giọng nói tiếng Việt
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-slate-700" />
              Tải PDF Vector A4 &amp; Gửi Email
            </span>
          </div>
        </div>

        {/* 3. INTERACTIVE LIVE DEMO PREVIEW (CEO COCKPIT PREVIEW BANNER) */}
        <div 
          onClick={onExploreSample}
          className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-lg cursor-pointer group transition-all hover:border-blue-400 p-5 sm:p-7 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Mẫu Bản Đồ Chẩn Đoán Thực Tế: Doanh Nghiệp Nước Mắm Hải Hương
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Bấm để khám phá toàn bộ kết quả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* 3 Thẻ Trực Quan Demo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Điểm sức khỏe */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <div className="text-[11px] font-extrabold uppercase text-blue-800">Sức Khỏe Doanh Nghiệp</div>
              <div className="text-3xl font-black text-blue-700">
                68<span className="text-xs text-slate-400 font-bold">/100</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Sản phẩm cốt lõi tốt, rò rỉ dòng tiền ở khâu giữ chân khách cũ.
              </p>
            </div>

            {/* Box 2: Đòn bẩy 30 ngày */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-1">
              <div className="text-[11px] font-extrabold uppercase text-amber-900 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                Đòn Bẩy 30 Ngày (80/20)
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-950">
                👉 Kích hoạt chuỗi chăm sóc khách cũ tự động qua Zalo
              </div>
              <p className="text-[11px] text-emerald-800 font-bold">
                ✓ Kỳ vọng tăng 25% doanh thu không tốn chi phí ads
              </p>
            </div>

            {/* Box 3: 5 Zone Điểm nghẽn */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-extrabold uppercase text-slate-700">5 Zone Dòng Tiền</div>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Thị trường: Tốt</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Bán hàng: Nghẽn</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Vận hành: 58%</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Định vị điểm tiền bị rơi rụng trong chuỗi vận hành.
              </p>
            </div>

          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Bao gồm: Canvas 9 ô • Ma trận 10 năng lực 1-5 • Lộ trình 90 ngày • Xuất PDF &amp; Email</span>
            <span className="text-blue-600 font-bold underline">Xem chi tiết &rarr;</span>
          </div>
        </div>

        {/* 4. BỘ 3 GIÁ TRỊ CỐT LÕI (TINH GỌN, KHÔNG DÀI DÒNG) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">10 Phút Giọng Nói Đời Thường</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CEO trả lời tự nhiên qua giọng nói hoặc bấm chọn nhanh. Không cần chuẩn bị slide báo cáo phức tạp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Định Vị 5 Zone Điểm Nghẽn</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chỉ rõ vị trí rò rỉ dòng tiền theo lý thuyết TOC và phân tích 5-Why để tìm nguyên nhân gốc rễ.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Xuất PDF &amp; Email Tự Động</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhận tệp PDF vector A4 chuẩn Executive hoặc tự động gửi về Email CEO để bàn giao cho đội ngũ.
            </p>
          </div>
        </div>

        {/* 5. BOTTOM CTA BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Sẵn Sàng Khám Sức Khỏe Doanh Nghiệp?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            10 phút hôm nay giúp CEO nhìn rõ toàn cảnh và tiết kiệm hàng trăm triệu chi phí rò rỉ.
          </p>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartCheckup}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>BẮT ĐẦU KHÁM NGAY (MIỄN PHÍ)</span>
            </button>
            <button
              onClick={onExploreSample}
              className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/20"
            >
              <span>Xem Bản Đồ Kết Quả Mẫu &rarr;</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
