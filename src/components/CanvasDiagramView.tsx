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
  Sparkles,
} from 'lucide-react';
import { DiagnosisReport } from '../types';

interface CanvasDiagramViewProps {
  report: DiagnosisReport;
}

export const CanvasDiagramView: React.FC<CanvasDiagramViewProps> = ({ report }) => {
  const profile = report.profile;
  const bName = profile.businessName || 'Nước Mắm Hải Hương';
  const canvas = report.canvas;

  // Trích xuất an toàn dữ liệu từ canvas của báo cáo chuẩn
  const keyPartners = canvas?.keyPartners?.current || [
    'Hợp tác xã ngư dân đánh bắt ven biển (Cá cơm than nguyên chất)',
    'Nhà cung cấp chai thủy tinh cao cấp & nhãn in tem QR',
    'Mạng lưới đại lý chợ truyền thống & chuỗi thực phẩm sạch',
  ];

  const keyActivities = canvas?.keyActivities?.current || [
    'Thu mua cá cơm tươi tại cảng & kiểm soát tỷ lệ muối 3:1',
    'Chăm sóc ủ chượp thùng gỗ bời lời, kéo rút nước mắm nhĩ 18 tháng',
    'Đóng chai tem nhãn QR và phân phối tới đại lý/khách hàng',
  ];

  const keyResources = canvas?.keyResources?.current || [
    'Nhà thùng ủ chượp truyền thống hơn 100 thùng gỗ bời lời',
    'Bí quyết công thức gia truyền 3 đời & chứng nhận OCOP 4 sao',
    'Tài sản số hóa: Danh sách khách hàng và Zalo OA Bếp Việt',
  ];

  const valuePropositions = canvas?.valuePropositions?.current || [
    'Nước mắm cá cơm than truyền thống 35N - 42N nguyên chất 100%',
    'An toàn tuyệt đối không chất bảo quản công nghiệp, đậm vị truyền thống',
    'Hành trình ẩm thực Bếp Việt: Combo kho - nấu - chấm tiện lợi',
  ];

  const customerRelationships = canvas?.customerRelationships?.current || [
    'Giao dịch mua lẻ tại điểm bán & gian hàng trực tuyến',
    'Cơ chế Re-Purchase: Nhắc mua lại tự động qua Zalo OA chu kỳ 45-60 ngày',
    'Câu lạc bộ Yêu Bếp Việt: Tích điểm tri ân & tặng công thức món ngon',
  ];

  const channels = canvas?.channels?.current || [
    'Đại lý truyền thống, tạp hóa & chợ đầu mối địa phương',
    'Kênh trực tiếp D2C qua Zalo OA & Quét mã QR trên nhãn chai',
    'Sàn TMĐT Shopee/Lazada & Kênh quà biếu doanh nghiệp',
  ];

  const customerSegments = canvas?.customerSegments?.current || [
    'Hộ gia đình nội trợ coi trọng bữa ăn an toàn và sức khỏe con trẻ',
    'Các nhà hàng món Việt truyền thống, bếp ăn cao cấp sành ăn',
    'Doanh nghiệp & khách du lịch mua làm quà biếu đặc sản lễ Tết',
  ];

  const costStructure = canvas?.costStructure?.current || [
    'Chi phí nguyên liệu cá cơm tươi & muối sạch tự nhiên (45%)',
    'Chiết khấu đại lý trung gian và phí vận chuyển đường bộ (25%)',
    'Chi phí nhân công nhà thùng, đóng chai và vật tư bao bì (20%)',
    'Chi phí nền tảng số hóa Zalo OA và tem QR Code (10%)',
  ];

  const revenueStreams = canvas?.revenueStreams?.current || [
    'Bán lẻ trực tiếp từng chai nước mắm nguyên chất (35N, 40N, 42N)',
    'Đơn hàng bán sỉ định kỳ cho đại lý và cửa hàng đặc sản',
    'Combo gia vị Bếp Việt & Gói thuê bao giao nước mắm định kỳ 6 tháng',
    'Set quà biếu Tết doanh nghiệp cao cấp biên lợi nhuận gộp 55%',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 lg:p-9 space-y-6">
      
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
            Đồng bộ toàn diện giữa năng lực ủ chượp truyền thống và cỗ máy tăng trưởng trực tiếp D2C số hóa.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Trực Quan Hóa 9 Khối Cốt Lõi</span>
        </div>
      </div>

      {/* 2. 3 CALLOUT CHIẾN LƯỢC TRÊN ĐẦU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center items-center">
        
        {/* Callout Trái (Đỏ/Hồng) */}
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col items-center justify-center shadow-2xs">
          <div className="text-xs font-black uppercase tracking-tight">
            Nguồn Cung Cá Cơm &amp; Bí Quyết Ủ Chượp
          </div>
          <div className="mt-1 flex items-center gap-1 text-rose-700 font-extrabold text-[11px]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Nền Tảng Cốt Lõi Làng Nghề</span>
          </div>
        </div>

        {/* Callout Giữa (Vàng) */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col items-center justify-center shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">TRỌNG TÂM CHIẾN LƯỢC</span>
          <div className="text-xs sm:text-sm font-black uppercase tracking-tight text-amber-950 mt-0.5">
            GIẢI PHÁP BẾP VIỆT &amp; RE-PURCHASE
          </div>
        </div>

        {/* Callout Phải (Xanh Lá) */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col items-center justify-center shadow-2xs">
          <div className="text-xs font-black uppercase tracking-tight">
            Mở Rộng Kênh Trực Tiếp D2C &amp; Khách Quen
          </div>
          <div className="mt-1 flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Đòn Bẩy Dòng Tiền Tự Động</span>
          </div>
        </div>

      </div>

      {/* 3. KHUNG CANVAS 9 Ô LỚN VỚI PHÂN VÙNG MÀU CHUẨN XANH - VÀNG - HỒNG */}
      <div className="border-2 border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* HÀNG TRÊN: 5 CỘT (RESPONSIVE CHO TABLET & MOBILE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:gap-0 lg:divide-x divide-slate-800 border-b-2 border-slate-800">
          
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

              <div className="mt-3 space-y-2 text-xs text-slate-800">
                {keyPartners.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white/85 rounded-xl border border-blue-200 space-y-0.5">
                    <p className="text-[11px] text-slate-800 font-medium leading-snug">
                      • {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-extrabold text-blue-900 bg-blue-200/70 p-1.5 rounded-lg text-center">
              Bảo chứng nguồn cá &amp; Chuỗi cung ứng
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
                {keyActivities.map((act, idx) => (
                  <div key={idx} className="p-2 bg-white/85 rounded-xl border border-amber-200">
                    <span className="text-slate-800">• {act}</span>
                  </div>
                ))}
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
                {keyResources.map((res, idx) => (
                  <div key={idx} className="p-2 bg-white/85 rounded-xl border border-amber-200">
                    <span className="text-slate-800">• {res}</span>
                  </div>
                ))}
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
                {valuePropositions.map((val, idx) => (
                  <div key={idx} className="p-2.5 bg-white/90 rounded-xl border border-orange-200 space-y-0.5">
                    <p className="text-[11px] text-slate-800 font-bold leading-snug">
                      ✨ {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-black text-orange-950 bg-orange-200 p-2 rounded-xl text-center shadow-2xs">
              🌟 TRỌNG TÂM ĐỘ ĐẠM NGUYÊN CHẤT &amp; VỊ NGON TRUYỀN THỐNG
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
                {customerRelationships.map((cr, idx) => (
                  <div key={idx} className="p-2 bg-white/85 rounded-xl border border-rose-200">
                    <span className="text-slate-800">• {cr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kênh phân phối */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-300">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">KÊNH TIẾP CẬN</h3>
                  <span className="text-[10px] font-bold text-rose-800">Channels</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-800 pt-1 font-medium">
                {channels.map((ch, idx) => (
                  <div key={idx} className="p-2 bg-white/85 rounded-xl border border-rose-200">
                    <span className="text-slate-800">• {ch}</span>
                  </div>
                ))}
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
                {customerSegments.map((cs, idx) => (
                  <div key={idx} className="p-2.5 bg-white/85 rounded-xl border border-rose-200 space-y-0.5">
                    <p className="text-[11px] text-slate-800 font-medium leading-snug">
                      • {cs}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-extrabold text-rose-900 bg-rose-200/70 p-1.5 rounded-lg text-center">
              Khách hàng gia đình &amp; Đối tác trung thành
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 pt-1">
              {costStructure.map((cost, idx) => (
                <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">• {cost}</span>
                </div>
              ))}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium text-slate-800 pt-1">
              {revenueStreams.map((rev, idx) => (
                <div key={idx} className="p-2 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-950">💵 {rev}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
