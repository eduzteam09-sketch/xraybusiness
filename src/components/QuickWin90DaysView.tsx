import React from 'react';
import {
  QrCode,
  Smartphone,
  RefreshCw,
  Repeat,
  CheckCircle2,
  TrendingUp,
  Coins,
  Database,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Users,
  Award,
} from 'lucide-react';
import { DiagnosisReport } from '../types';

interface QuickWin90DaysViewProps {
  report: DiagnosisReport;
}

export const QuickWin90DaysView: React.FC<QuickWin90DaysViewProps> = ({ report }) => {
  const profile = report.profile;
  const bName = profile.businessName || 'HẢI HƯƠNG';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 font-sans">
      
      {/* 1. HEADER CHUẨN ĐỒ HỌA NHƯ HÌNH 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <span>QUICK WIN 90 NGÀY — {bName}</span>
          </h2>
          <p className="text-xs sm:text-base font-extrabold text-rose-600 mt-1">
            Không tìm khách mới trước — Khai thác tối đa giá trị từ khách đã mua hàng.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-2xl text-xs font-black shrink-0">
          ⚡ CHIẾN LƯỢC ĐÒN BẨY SỐ 1 TRONG 90 NGÀY
        </div>
      </div>

      {/* 2. KHỐI 1, 2, 3, 4: VẤN ĐỀ - GIẢI PHÁP - VÒNG LẶP DOANH THU - QR DỮ LIỆU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Khối 1 & 2: Vấn đề & Giải pháp Quick Win */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          {/* Khối 1: Vấn đề */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-1.5">
              <span>1. VẤN ĐỀ HIỆN TẠI</span>
            </div>
            <p className="text-xs font-bold leading-relaxed text-slate-200">
              Khách đã mua nhưng chưa được kích hoạt thành quan hệ dài hạn, dễ bị đối thủ lôi kéo.
            </p>
          </div>

          {/* Khối 2: Giải pháp Quick Win */}
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2 flex-1">
            <div className="text-[10px] font-black uppercase text-rose-800">
              2. GIẢI PHÁP QUICK WIN
            </div>
            <div className="text-xs font-black text-rose-950 uppercase">
              RE-PURCHASE ENGINE
            </div>
            <div className="space-y-1 text-[11px] font-bold text-rose-900">
              <div>• QR trên sản phẩm → Thu dữ liệu</div>
              <div>• Phân nhóm → Nhắc mua lại đúng chu kỳ</div>
              <div>• Upsell / Cross-sell combo giá trị cao</div>
            </div>
          </div>
        </div>

        {/* Khối 3: Sơ đồ vòng lặp tạo doanh thu (Re-Purchase Engine Flow Diagram) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="text-[11px] font-black uppercase text-blue-800 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>3. RE-PURCHASE ENGINE — VÒNG LẶP TẠO DOANH THU</span>
            <span className="text-[10px] text-slate-500">Tự Động Hóa Vòng Lặp</span>
          </div>

          {/* Sơ đồ tương tác luân chuyển */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-base">👥</div>
              <div className="text-[10px] font-black mt-1">KHÁCH ĐÃ MUA</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-base">📝</div>
              <div className="text-[10px] font-black mt-1">GHI NHẬN DATA</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-base">🍾</div>
              <div className="text-[10px] font-black mt-1">XÁC ĐỊNH SP &amp; NGÀY</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-base">🔔</div>
              <div className="text-[10px] font-black mt-1 text-rose-600">NHẮC MUA LẠI</div>
            </div>
            <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-300 shadow-2xs">
              <div className="text-base">🛒</div>
              <div className="text-[10px] font-black mt-1 text-emerald-900">MUA LẠI &amp; UPSELL</div>
            </div>
          </div>

          {/* Vòng lặp dữ liệu khép kín */}
          <div className="p-3 bg-white rounded-xl border border-blue-200 text-center text-xs text-blue-900 font-bold space-y-1">
            <div className="text-[11px]">
              Giao dịch → Dữ liệu → Thấu hiểu → Cá nhân hóa → Mua lại → Dữ liệu mới 🔄
            </div>
            <div className="text-[10px] text-slate-500 font-normal">
              Mục tiêu: Tăng doanh thu từ khách cũ • Tăng CLV • Giảm CAC • Tạo tài sản dữ liệu
            </div>
          </div>
        </div>

        {/* Khối 4: QR Code trên sản phẩm — Đòn bẩy dữ liệu */}
        <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between space-y-3 border border-slate-800">
          <div className="text-[11px] font-black uppercase text-amber-300 pb-2 border-b border-slate-800">
            4. QR CODE — ĐÒN BẨY DỮ LIỆU
          </div>

          <div className="flex items-center gap-3 bg-slate-800/90 p-3 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center p-1 shrink-0">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-amber-300">Quét QR trên chai</div>
              <div className="text-[10px] text-slate-300">Khám phá công thức nấu &amp; nhận ưu đãi thành viên</div>
            </div>
          </div>

          {/* Mockup màn hình điện thoại Bếp Việt */}
          <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-[10px] space-y-1 text-slate-300">
            <div className="font-bold text-white flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Bếp Việt cùng {bName}:</span>
            </div>
            <div>• Video công thức món ngon</div>
            <div>• Ưu đãi lần mua tiếp theo</div>
            <div>• Để lại SĐT / Zalo nhận quà</div>
          </div>
        </div>

      </div>

      {/* 3. KHỐI 5: LỘ TRÌNH 90 NGÀY 3 GIAI ĐOẠN (CHI TIẾT NHƯ HÌNH 4) */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>5. LỘ TRÌNH 90 NGÀY THỰC THI TUẦN TỰ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Giai đoạn 1 */}
          <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-200 text-blue-900 uppercase">
              GIAI ĐOẠN 1: 0 - 30 NGÀY
            </span>
            <div className="text-xs font-black text-slate-900 uppercase">
              THU GOM &amp; CHUẨN HÓA DỮ LIỆU
            </div>
            <p className="text-[11px] text-slate-600">
              Thu thập từ: Website, Zalo OA, Đại lý, Hóa đơn... 5 trường dữ liệu cốt lõi:
            </p>
            <div className="grid grid-cols-3 gap-1 text-center text-[9.5px] font-bold">
              <span className="bg-white p-1 rounded border">Khách hàng</span>
              <span className="bg-white p-1 rounded border">SĐT/Zalo</span>
              <span className="bg-white p-1 rounded border">Sản phẩm</span>
            </div>
            <div className="pt-2 border-t border-blue-200 text-[11px] font-bold text-blue-800">
              ✓ Kết quả: Chuyển từ "có khách hàng" sang "sở hữu dữ liệu khách hàng".
            </div>
          </div>

          {/* Giai đoạn 2 */}
          <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900 uppercase">
              GIAI ĐOẠN 2: 30 - 60 NGÀY
            </span>
            <div className="text-xs font-black text-slate-900 uppercase">
              KÍCH HOẠT MUA LẠI TỰ ĐỘNG
            </div>
            <p className="text-[11px] text-slate-600">
              Nhắc mua lại đúng chu kỳ sử dụng sản phẩm bằng tin nhắn tự động:
            </p>
            <div className="space-y-1 text-[11px] text-slate-700">
              <div>• Zalo OA / SMS / Email Automation</div>
              <div>• Thông điệp cá nhân hóa theo từng loại hàng</div>
              <div>• Ưu đãi có mục tiêu (không giảm giá đại trà)</div>
            </div>
            <div className="pt-2 border-t border-amber-200 text-[11px] font-bold text-amber-900">
              ✓ Kết quả: Tăng ngay 15 - 25% tỷ lệ khách mua lại.
            </div>
          </div>

          {/* Giai đoạn 3 */}
          <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-900 uppercase">
              GIAI ĐOẠN 3: 60 - 90 NGÀY
            </span>
            <div className="text-xs font-black text-slate-900 uppercase">
              UPSELL / CROSS-SELL ĐA SẢN PHẨM
            </div>
            <p className="text-[11px] text-slate-600">
              Gia tăng giá trị đơn hàng trung bình từ tệp khách quen tin cậy:
            </p>
            <div className="space-y-1 text-[11px] text-slate-700">
              <div>• Mua lại sp cũ → Upsell sản phẩm cao đạm hơn</div>
              <div>• Cross-sell combo gia vị &amp; hộp quà ẩm thực</div>
            </div>
            <div className="pt-2 border-t border-emerald-200 text-[11px] font-bold text-emerald-900">
              ✓ Kết quả: Tăng AOV • Tăng CLV • Bứt phá doanh thu quý.
            </div>
          </div>

        </div>
      </div>

      {/* 4. KHỐI 6 & 7: TÁC ĐỘNG & 5 THẺ KPI QUICK WIN (NHƯ HÌNH 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Khối 6: Tác động (4 Cột Grid) */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800">
          <div className="text-[11px] font-black uppercase text-amber-300 pb-2 border-b border-slate-800">
            6. TÁC ĐỘNG CHIẾN LƯỢC
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">✓</span> Tăng doanh thu trực tiếp từ khách cũ
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">✓</span> Tăng CLV (Giá trị vòng đời khách hàng)
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">✓</span> Giảm phụ thuộc chi phí quảng cáo (CAC)
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">✓</span> Sở hữu tài sản dữ liệu khách hàng
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">✓</span> Đặt nền móng cho AI &amp; Hệ sinh thái
            </div>
          </div>
        </div>

        {/* Khối 7: 5 Thẻ KPI Quick Win 90 Ngày (8 Cột Grid) */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="text-[11px] font-black uppercase text-blue-800 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>7. KPI ĐO LƯỜNG QUICK WIN 90 NGÀY</span>
            <span className="text-[10px] text-slate-500">Đo lường hàng tuần</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400">KPI 1</div>
              <div className="text-[11px] font-black text-slate-900 mt-1">TỶ LỆ DATA NHẬN DIỆN</div>
              <div className="text-[10px] text-blue-600 font-bold mt-1">&gt; 70% GD</div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400">KPI 2</div>
              <div className="text-[11px] font-black text-slate-900 mt-1">REPEAT RATE</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">&gt; 35% khách</div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400">KPI 3</div>
              <div className="text-[11px] font-black text-slate-900 mt-1">DOANH THU KHÁCH CŨ</div>
              <div className="text-[10px] text-blue-600 font-bold mt-1">+25 - 35%</div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400">KPI 4</div>
              <div className="text-[11px] font-black text-slate-900 mt-1">AOV (ĐƠN TB)</div>
              <div className="text-[10px] text-indigo-600 font-bold mt-1">Tăng combo</div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold text-slate-400">KPI 5</div>
              <div className="text-[11px] font-black text-slate-900 mt-1">CLV (VÒNG ĐỜI)</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">Gấp 2 lần</div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. KHỐI 8: HÀNH TRÌNH DÀI HẠN TỪ QUICK WIN ĐẾN HỆ SINH THÁI (5 LEVEL) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-4">
        <div className="text-center">
          <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
            8. HÀNH TRÌNH DÀI HẠN — TỪ QUICK WIN ĐẾN HỆ SINH THÁI BỀN VỮNG
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-[10px] font-bold text-blue-300">LEVEL 1</div>
            <div className="font-black text-white text-xs mt-1">QUICK WIN 0-90N</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Khách cũ → Mua lại QR</div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-[10px] font-bold text-blue-300">LEVEL 2</div>
            <div className="font-black text-white text-xs mt-1">CRM &amp; AUTOMATION</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Phân nhóm tự động</div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-[10px] font-bold text-blue-300">LEVEL 3</div>
            <div className="font-black text-white text-xs mt-1">AI &amp; CÁ NHÂN HÓA</div>
            <div className="text-[10px] text-slate-300 mt-0.5">AI dự báo chu kỳ mua</div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-[10px] font-bold text-blue-300">LEVEL 4</div>
            <div className="font-black text-white text-xs mt-1">CỘNG ĐỒNG KHÁCH</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Nội dung kết nối thân thiết</div>
          </div>

          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/40">
            <div className="text-[10px] font-black text-amber-300">LEVEL 5</div>
            <div className="font-black text-amber-200 text-xs mt-1">HỆ SINH THÁI</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Đối tác &amp; Dòng tiền chuỗi</div>
          </div>
        </div>

        {/* Footer Gold Quote như Hình 4 */}
        <div className="text-center pt-2 text-xs font-bold text-amber-300">
          ★ Không chỉ có thêm doanh thu. Sau 90 ngày, {bName} bắt đầu sở hữu một "Customer Data Asset" — nền tảng vững chắc để mở khóa AI và Hệ sinh thái bền vững.
        </div>
      </div>

    </div>
  );
};
