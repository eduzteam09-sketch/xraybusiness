import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Briefcase,
  Check,
  Eye,
  Sparkles,
  LayoutDashboard,
  Grid,
  AlertTriangle,
  CalendarCheck2,
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
  const [industry, setIndustry] = useState<string>('Sản xuất thực phẩm & Đồ uống (F&B)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartCheckup({
      ceoName: ceoName.trim() || 'CEO',
      email: email.trim(),
      businessName: businessName.trim() || 'Doanh Nghiệp Của Bạn',
      industry: industry.trim() || 'Kinh doanh & Dịch vụ',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-bold border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider">
            AI-FIRST 2026
          </span>
          <span className="text-slate-200">
            Hệ Thống Chẩn Đoán Sức Khỏe &amp; Điểm Nghẽn Dành Cho CEO Việt Nam
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-amber-300 font-extrabold">
            Tối Giản Chữ — Tối Đa Trực Quan
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-12">
        
        {/* 2. HERO GRID: REFERO STYLE (LEFT VALUE & PREVIEW, RIGHT INTAKE CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: THÔNG ĐIỆP & 4 ĐỒ HỌA TRỰC QUAN (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Độc Quyền Dành Cho Lãnh Đạo &amp; Chủ Doanh Nghiệp SME</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Khám Sức Khỏe Doanh Nghiệp.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-600 mt-1">
                Nhìn Thấu Điểm Nghẽn Trong 60s.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              CEO không có thời gian đọc văn bản dài. Hệ thống tự động phân tích và xuất <strong>5 bản đồ trực quan</strong>: từ định vị khác biệt, radar 10 trục, canvas 9 ô đến lộ trình 90 ngày.
            </p>

            {/* 4 THẺ SƠ ĐỒ TRỰC QUAN (CLICK ĐỂ XEM MẪU NGAY) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              <div 
                onClick={() => onExploreSample('hai-huong')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    01
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                    Radar 10 Trục Sức Khỏe
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Đo lường năng lực so với chuẩn ngành, khoanh vùng chính xác điểm rò rỉ.
                </p>
              </div>

              <div 
                onClick={() => onExploreSample('hai-huong')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    02
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                    Bảng Canvas 9 Khối Bento
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Mô hình kinh doanh trực quan 3 tầng, phân bổ liên minh và hệ sinh thái số.
                </p>
              </div>

              <div 
                onClick={() => onExploreSample('hai-huong')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    03
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                    Bản Đồ 5 Zone Điểm Nghẽn
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Bóc tách 5 vùng rò rỉ dòng tiền: Nhận biết, Tương tác, Chuyển đổi &amp; Mua lại.
                </p>
              </div>

              <div 
                onClick={() => onExploreSample('hai-huong')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    04
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                    Quick Win &amp; Lộ Trình 90N
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Vòng lặp Re-purchase Engine tự động, QR thu thập dữ liệu và 5 KPI.
                </p>
              </div>

            </div>

            {/* TRUST BULLETS */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Không đọc nhiều chữ
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                Phỏng vấn giọng nói AI
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-slate-800 shrink-0" />
                Tải PDF A4 &amp; Gửi Email
              </span>
            </div>

          </div>

          {/* CỘT PHẢI: FORM NHẬP THÔNG TIN CEO (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-5">
            
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                KHỞI ĐỘNG CHẨN ĐOÁN
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Thông Tin Doanh Nghiệp
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CEO nhập thông tin để hệ thống khởi tạo hồ sơ cá nhân hóa
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Họ và Tên CEO / Lãnh Đạo</span>
                </label>
                <input
                  type="text"
                  required
                  value={ceoName}
                  onChange={(e) => setCeoName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Email Nhận Báo Cáo Chiến Lược</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ceo@doanhnghiep.vn"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tên Doanh Nghiệp / Thương Hiệu</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ví dụ: Nước Mắm Hải Hương"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lĩnh Vực / Ngành Nghề</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold transition-all"
                >
                  <option value="Sản xuất thực phẩm & Đồ uống (F&B)">Sản xuất thực phẩm &amp; Đồ uống (F&B)</option>
                  <option value="Bán lẻ & Chuỗi phân phối tiêu dùng">Bán lẻ &amp; Chuỗi phân phối tiêu dùng</option>
                  <option value="Công nghệ số, Phần mềm & AI">Công nghệ số, Phần mềm &amp; AI</option>
                  <option value="Dịch vụ B2B, Tư vấn & Đào tạo">Dịch vụ B2B, Tư vấn &amp; Đào tạo</option>
                  <option value="Y tế, Chăm sóc sức khỏe & Thẩm mỹ">Y tế, Chăm sóc sức khỏe &amp; Thẩm mỹ</option>
                  <option value="Nông nghiệp & Sản phẩm làng nghề OCOP">Nông nghiệp &amp; Sản phẩm làng nghề OCOP</option>
                </select>
              </div>

              {/* 2 NÚT HÀNH ĐỘNG */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>BẮT ĐẦU PHỎNG VẤN CHẨN ĐOÁN (10 PHÚT)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onExploreSample('hai-huong')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Xem Bản Đồ Mẫu Có Sẵn (Hải Hương)</span>
                </button>
              </div>

            </form>

            {/* QUICK SWITCHER 3 HỒ SƠ MẪU */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 mb-2">
                Hoặc khám phá nhanh 3 hồ sơ doanh nghiệp thực tế:
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <button
                  onClick={() => onExploreSample('hai-huong')}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  Nước Mắm Hải Hương
                </button>
                <button
                  onClick={() => onExploreSample('sme-coffee')}
                  className="p-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  Chuỗi Bán Lẻ F&amp;B
                </button>
                <button
                  onClick={() => onExploreSample('b2b-consulting')}
                  className="p-1.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  Công Nghệ &amp; AI
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
