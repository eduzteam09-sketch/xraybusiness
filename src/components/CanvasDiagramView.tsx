import React from 'react';
import {
  Handshake,
  Activity,
  Cpu,
  Package,
  MessageSquare,
  Truck,
  Users,
  Receipt,
  Coins,
  ArrowUp,
  Grid,
} from 'lucide-react';
import { DiagnosisReport } from '../types';

interface CanvasDiagramViewProps {
  report: DiagnosisReport;
}

export const CanvasDiagramView: React.FC<CanvasDiagramViewProps> = ({ report }) => {
  const profile = report.profile;
  const bName = profile.businessName || 'Doanh Nghiệp';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-10 space-y-6 font-sans">
      
      {/* 1. HEADER CHUẨN KẾT QUẢ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-blue-600" />
            <span>03. BẢNG MÔ HÌNH KINH DOANH CANVAS 9 KHỐI BENTO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mô Hình Kinh Doanh Tái Cấu Trúc — {bName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mô hình trực quan: Đóng gói liên minh, số hóa quy trình và mở rộng kênh phân phối.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0">
          ⚡ Trực Quan Hóa 9 Khối Cốt Lõi
        </div>
      </div>

      {/* 2. 3 CALLOUT CHIẾN LƯỢC TRÊN ĐẦU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center items-center">
        
        {/* Callout Trái (Đỏ/Hồng) */}
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col items-center justify-center shadow-2xs">
          <div className="text-xs font-black uppercase tracking-tight">
            Liên Minh, R&amp;D &amp; Phát Triển Thị Trường
          </div>
          <div className="mt-1 flex items-center gap-1 text-rose-700 font-extrabold text-[11px]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Đòn Bẩy Mở Rộng Quy Mô</span>
          </div>
        </div>

        {/* Callout Giữa (Vàng) */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col items-center justify-center shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">TRỌNG TÂM CHIẾN LƯỢC</span>
          <div className="text-xs sm:text-sm font-black uppercase tracking-tight text-amber-950 mt-0.5">
            GIẢI PHÁP KINH DOANH SỐ &amp; AI
          </div>
        </div>

        {/* Callout Phải (Xanh Lá) */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col items-center justify-center shadow-2xs">
          <div className="text-xs font-black uppercase tracking-tight">
            Mạng Lưới Phân Phối Đa Tỉnh Thành
          </div>
          <div className="mt-1 flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Phân Phối Đa Kênh Điểm Chạm</span>
          </div>
        </div>

      </div>

      {/* 3. KHUNG CANVAS 9 Ô LỚN VỚI 3 MẢNG MÀU CHUẨN XANH - VÀNG - HỒNG */}
      <div className="border-2 border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* HÀNG TRÊN: 5 CỘT (CỘT 1 ĐẾN 5) */}
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* CỘT 1: ĐỐI TÁC CHÍNH (Xanh dương #dbeafe) */}
          <div className="bg-[#dbeafe] p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-blue-300">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">ĐỐI TÁC CHÍNH</h3>
                  <span className="text-[10px] font-bold text-blue-800">Key Partners</span>
                </div>
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-800">
                <div className="p-2.5 bg-white/85 rounded-xl border border-blue-200 space-y-0.5">
                  <div className="font-black text-blue-950 text-[11px]">🏛️ Trường Đại Học &amp; Viện:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Đội ngũ sinh viên khởi nghiệp, nghiên cứu &amp; đại sứ thương hiệu.</p>
                </div>

                <div className="p-2.5 bg-white/85 rounded-xl border border-blue-200 space-y-0.5">
                  <div className="font-black text-blue-950 text-[11px]">🤝 Liên Minh Doanh Nghiệp:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">CLB Doanh nhân, Hiệp hội ngành, mạng lưới bán chéo sản phẩm.</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-extrabold text-blue-900 bg-blue-200/70 p-1.5 rounded-lg text-center">
              Tối ưu chi phí R&amp;D &amp; Tiếp cận nhanh
            </div>
          </div>

          {/* CỘT 2: HOẠT ĐỘNG CHÍNH & NGUỒN LỰC CHÍNH (Vàng nhạt #fef3c7) */}
          <div className="bg-[#fef3c7] flex flex-col divide-y divide-slate-800">
            
            {/* Hoạt động chính */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-300">
                <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">HOẠT ĐỘNG CHÍNH</h3>
                  <span className="text-[10px] font-bold text-amber-800">Key Activities</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-800 pt-1 font-medium">
                <div className="p-2 bg-white/85 rounded-xl border border-amber-200">
                  <div className="font-bold text-amber-950">• Số hóa &amp; Tự động hóa:</div>
                  <span className="text-slate-700">Quy trình bán hàng, đóng gói combo và chăm sóc tự động.</span>
                </div>
                <div className="p-2 bg-white/85 rounded-xl border border-amber-200">
                  <div className="font-bold text-amber-950">• Đào tạo đội ngũ:</div>
                  <span className="text-slate-700">Chuẩn hóa SOP hướng dẫn bán hàng đa kênh.</span>
                </div>
              </div>
            </div>

            {/* Nguồn lực chính */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-300">
                <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">NGUỒN LỰC CHÍNH</h3>
                  <span className="text-[10px] font-bold text-amber-800">Key Resources</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-800 pt-1 font-medium">
                <div className="p-2 bg-white/85 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-950">• Nền tảng số &amp; CRM:</span> Dữ liệu khách hàng quen.
                </div>
                <div className="p-2 bg-white/85 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-950">• Công thức chất lượng:</span> Lợi thế cốt lõi.
                </div>
              </div>
            </div>

          </div>

          {/* CỘT 3: GIÁ TRỊ MANG LẠI (Trung tâm Vàng Đậm #fed7aa) */}
          <div className="bg-[#fed7aa] p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-orange-300">
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">GIÁ TRỊ CỐT LÕI</h3>
                  <span className="text-[10px] font-bold text-orange-900">Value Propositions</span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-800">
                <div className="p-2.5 bg-white/90 rounded-xl border border-orange-200 space-y-1">
                  <div className="font-black text-orange-950 text-[11px]">✨ Sản Phẩm Chuẩn Vị:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Chất lượng thật, an toàn sức khỏe, minh bạch nguồn gốc.</p>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-orange-200 space-y-1">
                  <div className="font-black text-orange-950 text-[11px]">🎁 Đóng Gói Combo Giá Trị:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Giải pháp quà biếu tinh tế và combo tiết kiệm cho gia đình.</p>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-orange-200 space-y-1">
                  <div className="font-black text-orange-950 text-[11px]">⚡ Trải Nghiệm Tiện Lợi:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Giao hàng nhanh, nhắc mua lại đúng chu kỳ tiêu dùng.</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-black text-orange-950 bg-orange-200 p-2 rounded-xl text-center shadow-2xs">
              🌟 TRỌNG TÂM TẠO DOANH THU &amp; BIÊN LỢI NHUẬN
            </div>
          </div>

          {/* CỘT 4: QUAN HỆ KHÁCH HÀNG & KÊNH PHÂN PHỐI (Hồng phấn #ffe4e6) */}
          <div className="bg-[#ffe4e6] flex flex-col divide-y divide-slate-800">
            
            {/* Quan hệ khách hàng */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-300">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">QUAN HỆ KHÁCH</h3>
                  <span className="text-[10px] font-bold text-rose-800">Customer Relationships</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-800 pt-1 font-medium">
                <div className="p-2 bg-white/85 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-950">• Re-purchase Engine:</span> Nhắc mua tự động định kỳ.
                </div>
                <div className="p-2 bg-white/85 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-950">• Chăm sóc thân thiết:</span> Ưu đãi độc quyền tri ân.
                </div>
              </div>
            </div>

            {/* Kênh phân phối */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-300">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">KÊNH PHÂN PHỐI</h3>
                  <span className="text-[10px] font-bold text-rose-800">Channels</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-800 pt-1 font-medium">
                <div className="p-2 bg-white/85 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-950">• Kênh Online:</span> Website, Zalo OA, TikTok Shop.
                </div>
                <div className="p-2 bg-white/85 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-950">• Kênh Đối tác:</span> Đại lý liên minh địa phương.
                </div>
              </div>
            </div>

          </div>

          {/* CỘT 5: PHÂN KHÚC KHÁCH HÀNG (Hồng cam #fecdd3) */}
          <div className="bg-[#fecdd3] p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-rose-300">
                <div className="w-8 h-8 rounded-xl bg-rose-700 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">PHÂN KHÚC KHÁCH</h3>
                  <span className="text-[10px] font-bold text-rose-900">Customer Segments</span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-800">
                <div className="p-2.5 bg-white/85 rounded-xl border border-rose-200 space-y-0.5">
                  <div className="font-black text-rose-950 text-[11px]">👨‍👩‍👧 Gia Đình Sành Ăn:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Ưu tiên bữa ăn dinh dưỡng, an toàn và ngon miệng.</p>
                </div>

                <div className="p-2.5 bg-white/85 rounded-xl border border-rose-200 space-y-0.5">
                  <div className="font-black text-rose-950 text-[11px]">🏢 Khách Hàng B2B &amp; Quà Biếu:</div>
                  <p className="text-[11px] text-slate-700 leading-snug">Doanh nghiệp đặt hộp quà Tết, hội nghị và đối tác.</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-extrabold text-rose-900 bg-rose-200/70 p-1.5 rounded-lg text-center">
              Khách hàng trả tiền ổn định lâu dài
            </div>
          </div>

        </div>

        {/* HÀNG DƯỚI: 2 CỘT TÀI CHÍNH (CƠ CẤU CHI PHÍ & DÒNG DOANH THU) */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-50 border-t-2 border-slate-800">
          
          {/* CƠ CẤU CHI PHÍ */}
          <div className="p-4 bg-slate-100/90 space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
              <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase">CƠ CẤU CHI PHÍ</h3>
                <span className="text-[10px] font-bold text-slate-500">Cost Structure</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 pt-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">• Chi phí sản xuất &amp; R&amp;D</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">• Chi phí vận hành &amp; Đóng gói</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">• Chi phí nền tảng số CRM/AI</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">• Hoa hồng đối tác liên minh</span>
              </div>
            </div>
          </div>

          {/* DÒNG DOANH THU */}
          <div className="p-4 bg-emerald-50/70 space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-300">
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase">DÒNG DOANH THU</h3>
                <span className="text-[10px] font-bold text-emerald-800">Revenue Streams</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-800 pt-1">
              <div className="p-2 bg-white rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950">💵 Bán lẻ trực tiếp định kỳ</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950">📦 Đóng gói combo giá trị cao</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950">🤝 Doanh số mạng lưới đại lý</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950">🎁 Đơn hàng B2B quà tặng mùa vụ</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
