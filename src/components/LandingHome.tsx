import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Target,
  BarChart3,
  Layers,
  Award,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  Compass,
  Grid,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_PROFILES_LIST } from '../data/sampleProfiles';

interface LandingHomeProps {
  onStartCheckup: (formData?: {
    ceoName: string;
    email: string;
    businessName: string;
    industry: string;
  }) => void;
  onExploreSample: (profileId?: string) => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onStartCheckup,
  onExploreSample,
}) => {
  const [ceoName, setCeoName] = useState<string>('');
  const [email, setEmail] = useState<string>('eduzteam09@gmail.com');
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartCheckup({
      ceoName: ceoName.trim() || 'CEO',
      email: email.trim(),
      businessName: businessName.trim() || 'Doanh Nghiệp Của Bạn',
      industry: industry.trim() || 'Kinh doanh & Dịch vụ',
    });
  };

  const handleQuickFill = (name: string, biz: string, ind: string) => {
    setCeoName(name);
    setBusinessName(biz);
    setIndustry(ind);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO BANNER: THIẾT KẾ ĐẲNG CẤP EXECUTIVE CHUẨN DOANH NGHIỆP */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#091124] via-[#0f172a] to-[#1e1b4b] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle glowing ambient lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* CỘT TRÁI: TIÊU ĐỀ & GIỚI THIỆU CHIẾN LƯỢC (7 COLS) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/15 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>HỆ THỐNG ĐỘC QUYỀN DÀNH CHO CEO &amp; CHỦ DOANH NGHIỆP VIỆT NAM</span>
              </div>

              {/* Tiêu đề được thiết kế text-balance chống tuyệt đối việc rớt 1 chữ đơn lẻ */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.18] tracking-tight text-balance">
                  Khám Sức Khỏe &amp; Bản Đồ Điểm Nghẽn Doanh Nghiệp
                </h1>
                
                <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-blue-300 text-balance">
                  Nhìn Thấu Rò Rỉ Dòng Tiền • Bứt Phá Lợi Nhuận Trong 90 Ngày
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl text-pretty">
                CEO không cần đọc các báo cáo dài dòng. Nền tảng AI-First cô đọng toàn bộ doanh nghiệp thành <strong>5 bản đồ trực quan</strong>: từ định vị khác biệt, radar 10 trục sức khỏe, canvas 9 khối bento đến lộ trình bứt phá doanh thu.
              </p>

              {/* 3 cam kết chuẩn lãnh đạo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">Tối giản chữ — Tối đa đồ họa</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">Phỏng vấn trợ lý AI 6 bước</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">Xuất Báo Cáo PDF A4 Chuẩn</span>
                </div>
              </div>

              {/* Quick sample button for Nước Mắm Hải Hương */}
              <div className="pt-2 flex items-center gap-2.5 flex-wrap">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Hồ sơ mẫu chuẩn:</span>
                </span>
                <button
                  type="button"
                  onClick={() => onExploreSample('hai-huong')}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 shadow-xs hover:border-amber-400/50 transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-100 group-hover:text-white">Nước Mắm Hải Hương (OCOP 4 Sao)</span>
                </button>
              </div>

            </div>

            {/* CỘT PHẢI: FORM NHẬP THÔNG TIN CEO (5 COLS) */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative">
              
              <div className="pb-4 border-b border-slate-100 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  KHỞI ĐỘNG PHIÊN CHẨN ĐOÁN
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Thông Tin Doanh Nghiệp
                </h2>
                <p className="text-xs text-slate-500">
                  Hệ thống thiết lập hồ sơ và chuẩn bị 10 trục đo lường riêng biệt
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Họ và Tên CEO / Lãnh Đạo</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ceoName}
                    onChange={(e) => setCeoName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Hoàng"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-slate-900 font-bold transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Nhận Bản Phân Tích &amp; Báo Cáo PDF</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ceo@doanhnghiep.vn"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-slate-900 font-bold transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tên Doanh Nghiệp / Thương Hiệu</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ví dụ: Công ty Cổ phần Thực phẩm An Phú"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-slate-900 font-bold transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ngành Nghề Hoạt Động</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Nhập ngành nghề (Ví dụ: Sản xuất F&B, Bán lẻ mỹ phẩm, Dịch vụ B2B...)"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-slate-900 font-bold transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[11px] text-slate-400 font-medium">Gợi ý nhanh:</span>
                    {[
                      'Sản xuất & Chế biến F&B',
                      'Bán lẻ & Thương mại',
                      'Dịch vụ B2B & Tư vấn',
                      'Nông nghiệp OCOP',
                      'Y tế & Chăm sóc sức khỏe',
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setIndustry(item)}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Bắt Đầu Khám Ngay (Miễn Phí)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <div className="text-[11px] text-slate-400 text-center font-medium">
                  🔒 100% Bảo mật dữ liệu kinh doanh • Không cần cài đặt phần mềm
                </div>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* 2. STAT BANNER: CON SỐ NỔI BẬT (CHUẨN HÌNH MẪU ĐÍNH KÈM) */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="p-3 sm:px-6 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">10 Trục</div>
                <div className="text-xs font-bold text-slate-500">Đo lường năng lực toàn diện</div>
              </div>
            </div>

            <div className="p-3 sm:px-6 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-black">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">9 Khối</div>
                <div className="text-xs font-bold text-slate-500">Canvas kinh doanh Bento</div>
              </div>
            </div>

            <div className="p-3 sm:px-6 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-black">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">5 Zone</div>
                <div className="text-xs font-bold text-slate-500">Bản đồ điểm nghẽn rò rỉ tiền</div>
              </div>
            </div>

            <div className="p-3 sm:px-6 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">90 Ngày</div>
                <div className="text-xs font-bold text-slate-500">Lộ trình Quick Win khách cũ</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION: QUY TRÌNH 6 BƯỚC KHÁM CHIẾN LƯỢC (01 -> 06) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            QUY TRÌNH CHUẨN ĐIỀU HÀNH
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
            Từ Phỏng Vấn Thích Ứng Đến Bản Đồ Chiến Lược
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Mỗi giai đoạn được tối ưu hóa tối đa về mặt đồ họa, giúp CEO nắm bắt bức tranh toàn cảnh mà không bị quá tải thông tin.
          </p>
        </div>

        {/* 6 Step Process Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">01</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Mô Hình Cốt Lõi</h3>
              <p className="text-[11px] text-slate-500 mt-1">Định vị sản phẩm &amp; lợi thế ban đầu</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">02</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Khách Hàng</h3>
              <p className="text-[11px] text-slate-500 mt-1">Chân dung nhóm khách chi trả chính</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">03</span>
              <Compass className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Kênh Bán &amp; CAC</h3>
              <p className="text-[11px] text-slate-500 mt-1">Chi phí chuyển đổi &amp; đa điểm chạm</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">04</span>
              <BarChart3 className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Dòng Tiền &amp; Mua Lại</h3>
              <p className="text-[11px] text-slate-500 mt-1">Tỷ lệ giữ chân khách cũ &amp; công nợ</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">05</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Vận Hành &amp; Đòn Bẩy</h3>
              <p className="text-[11px] text-slate-500 mt-1">Giảm phụ thuộc vào sự có mặt của CEO</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">06</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-emerald-950">Xuất Báo Cáo PDF</h3>
              <p className="text-[11px] text-slate-500 mt-1">Gửi trọn bộ tài liệu A4 vào Email CEO</p>
            </div>
          </div>

        </div>

      </section>

      {/* 4. SECTION: 4 MÀN HÌNH ĐỒ HỌA TRỰC QUAN SẴN SÀNG KHÁM PHÁ */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700">
                GIAO DIỆN TRỰC QUAN
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                4 Bản Đồ Điều Hành Chính Của CEO
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Bấm vào từng màn hình để xem mô hình mẫu chi tiết
              </p>
            </div>

            <button
              onClick={() => onExploreSample('hai-huong')}
              className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <span>Khám Phá Bản Đồ Mẫu Hải Hương (OCOP)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Vị thế */}
            <div
              onClick={() => onExploreSample('hai-huong')}
              className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600">
                  01. Vị Thế &amp; Khác Biệt
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  3 khối định vị phân khúc, tệp khách tạo tiền và 5 khía cạnh độc nhất đã kiểm chứng.
                </p>
              </div>
              <div className="text-xs font-black text-blue-600 flex items-center gap-1">
                <span>Khám phá sơ đồ →</span>
              </div>
            </div>

            {/* Card 2: Radar */}
            <div
              onClick={() => onExploreSample('hai-huong')}
              className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600">
                  02. Radar 10 Trục Sức Khỏe
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sơ đồ mạng nhện SVG 10 trục sức khỏe, so sánh điểm doanh nghiệp với chuẩn ngành.
                </p>
              </div>
              <div className="text-xs font-black text-indigo-600 flex items-center gap-1">
                <span>Khám phá sơ đồ →</span>
              </div>
            </div>

            {/* Card 3: Canvas */}
            <div
              onClick={() => onExploreSample('hai-huong')}
              className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-purple-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  <Grid className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-600">
                  03. Canvas 9 Khối Bento
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bảng mô hình kinh doanh Osterwalder trực quan, liên minh đối tác và kênh dòng tiền.
                </p>
              </div>
              <div className="text-xs font-black text-purple-600 flex items-center gap-1">
                <span>Khám phá sơ đồ →</span>
              </div>
            </div>

            {/* Card 4: Quick Win */}
            <div
              onClick={() => onExploreSample('hai-huong')}
              className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600">
                  04. Quick Win 90 Ngày
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cỗ máy Re-Purchase Engine 5 bước, kích hoạt khách cũ mua lại và đo lường 5 KPI.
                </p>
              </div>
              <div className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <span>Khám phá sơ đồ →</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FOOTER EXECUTIVE CHUYÊN NGHIỆP */}
      <footer className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-black text-white flex items-center gap-2 justify-center md:justify-start">
              <span>AI Business Health Checkup 2026</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-400/30 text-[10px]">
                CEO Executive Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hệ thống chẩn đoán sức khỏe, phát hiện rò rỉ dòng tiền và định vị mô hình kinh doanh doanh nghiệp.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hover:text-white transition-colors cursor-pointer">Bảo mật thông tin</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Chuẩn Canvas Osterwalder</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Bản quyền © 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
