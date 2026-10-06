import React from 'react';
import {
  AlertTriangle,
  Globe,
  Package,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Database,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { DiagnosisReport } from '../types';

interface BottleneckDiagramViewProps {
  report: DiagnosisReport;
}

export const BottleneckDiagramView: React.FC<BottleneckDiagramViewProps> = ({ report }) => {
  const profile = report.profile;
  const bName = profile.businessName || 'Doanh Nghiệp';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-10 space-y-8 font-sans">
      
      {/* 1. HEADER CHUẨN ĐỒ HỌA NHƯ HÌNH 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-rose-700 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>04. BẢN ĐỒ 5 ZONE ĐIỂM NGHẼN VẬN HÀNH DÒNG TIỀN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Bản Đồ Điểm Nghẽn — {bName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            Từ tài sản hiện có đến nhận diện 5 vùng rò rỉ dòng tiền và đòn bẩy tháo gỡ.
          </p>
        </div>

        {/* Legend mức độ ảnh hưởng */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl shrink-0">
          <span className="text-slate-500 uppercase text-[10px]">Mức độ:</span>
          <span className="flex items-center gap-1 text-rose-950 bg-rose-200 px-2 py-0.5 rounded-md font-black">
            <span className="w-2 h-2 rounded-full bg-rose-700"></span> Rất cao
          </span>
          <span className="flex items-center gap-1 text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Cao
          </span>
          <span className="flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Trung bình
          </span>
        </div>
      </div>

      {/* 2. KHU VỰC 3 CỘT ĐỒ HỌA (TÀI SẢN - 5 ZONE NGHẼN - GỐC RỄ & ĐÒN BẨY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* CỘT 1: TÀI SẢN HIỆN CÓ CỦA DOANH NGHIỆP (3 COLS) */}
        <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm border border-slate-800">
          <div>
            <div className="text-[11px] font-black uppercase text-blue-300 tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>TÀI SẢN HIỆN CÓ CỦA DN</span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/80">
                <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Kênh truyền thông &amp; Zalo</div>
                  <div className="text-[11px] text-slate-400">Kênh trao đổi với khách quen</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/80">
                <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Danh mục sản phẩm chất lượng</div>
                  <div className="text-[11px] text-slate-400">Nhiều phân khúc &amp; chủng loại</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/80">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Uy tín chất lượng cốt lõi</div>
                  <div className="text-[11px] text-slate-400">Khách hàng dùng thử hài lòng</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/80">
                <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Tệp khách hàng trung thành</div>
                  <div className="text-[11px] text-slate-400">Tỷ lệ hài lòng tự nhiên cao</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-800 rounded-xl text-center text-[10px] text-slate-300 font-bold">
            Tài sản tốt nhưng chưa được số hóa thành đòn bẩy
          </div>
        </div>

        {/* CỘT 2: 5 VÙNG NGHẼN DÒNG TIỀN (6 COLS) */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Zone 1: Nhận biết & Tiếp cận */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                ZONE 01 • NHẬN BIẾT &amp; TIẾP CẬN
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Mức độ: Trung bình
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Hiện diện số còn phân tán, phụ thuộc truyền miệng địa phương
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Chưa có chiến dịch định vị tập trung, chi phí tìm khách mới cao nếu chạy quảng cáo đại trà.
            </p>
          </div>

          {/* Zone 2: Tương tác & Đơn hàng */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-rose-300 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">
                ZONE 02 • TƯƠNG TÁC &amp; CHUYỂN ĐỔI
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                Mức độ: Cao
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Quy trình tư vấn chưa chuẩn hóa SOP, dễ rớt khách hàng tiềm năng
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Khách hỏi nhưng phản hồi chậm hoặc phụ thuộc vào từng nhân viên, tỷ lệ chốt đơn dao động.
            </p>
          </div>

          {/* Zone 3: Mua Lại (CRITICAL LEAK) */}
          <div className="p-3.5 bg-rose-50/90 rounded-2xl border-2 border-rose-500 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-900 tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                ZONE 03 • CƠ CHẾ MUA LẠI (TRỌNG TÂM RÒ RỈ)
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-700 text-white animate-pulse">
                Rất cao ⚠️
              </span>
            </div>
            <h4 className="text-xs font-black text-rose-950">
              Không có chu kỳ nhắc mua tự động, để rơi rụng 60% khách cũ
            </h4>
            <p className="text-[11px] text-rose-900 leading-snug">
              Khách dùng hết nhưng không ai chăm sóc lại, để đối thủ tiếp cận và kéo đi. Đây là lỗ thủng dòng tiền lớn nhất.
            </p>
          </div>

          {/* Zone 4: Khách Hàng Trung Thành */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-rose-300 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">
                ZONE 04 • GIỮ CHÂN &amp; UPSELL
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                Mức độ: Cao
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Chưa đóng gói combo quà tặng / B2B để tăng giá trị trung bình đơn
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Chủ yếu bán đơn lẻ, bỏ lỡ cơ hội upsell sang các gói định kỳ hoặc quà biếu doanh nghiệp.
            </p>
          </div>

          {/* Zone 5: Mở Rộng & Liên Minh */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                ZONE 05 • MỞ RỘNG &amp; NHÂN BẢN
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Mức độ: Trung bình
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Chưa xây dựng mạng lưới đại lý liên minh phân phối đa điểm
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Quy mô bị giới hạn trong khu vực cục bộ, chưa tận dụng đối tác có sẵn tệp khách.
            </p>
          </div>

        </div>

        {/* CỘT 3: NGUYÊN NHÂN GỐC RỄ & ĐÒN BẨY GIẢI PHÁP (3 COLS) */}
        <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>GỐC RỄ &amp; ĐÒN BẨY</span>
            </div>

            <div className="mt-3.5 space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-black text-rose-950 text-[11px]">🔴 Nguyên nhân gốc rễ:</div>
                <p className="text-[11px] text-slate-700 leading-snug">
                  Dữ liệu khách hàng bị bỏ rơi, quy trình vận hành phụ thuộc trí nhớ cá nhân thay vì hệ thống tự động.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-black text-emerald-950 text-[11px]">🟢 Đòn bẩy tài chính:</div>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  Triển khai ngay Re-purchase Engine: dùng QR thu thập data trên sản phẩm để kích hoạt khách mua lại.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <div className="font-black text-blue-950 text-[11px]">⚡ Tác động dự kiến:</div>
                <p className="text-[11px] text-blue-900 leading-snug font-bold">
                  Tăng ngay 25 - 40% doanh thu trong 90 ngày với chi phí tìm khách mới bằng 0.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-blue-600 text-white rounded-xl text-center text-[10px] font-black shadow-xs">
            Xem giải pháp chi tiết ở Tab 05 →
          </div>
        </div>

      </div>

    </div>
  );
};
