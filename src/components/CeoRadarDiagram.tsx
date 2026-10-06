import React from 'react';
import { AlertTriangle, Sparkles, LayoutDashboard } from 'lucide-react';
import { DiagnosisReport } from '../types';

interface CeoRadarDiagramProps {
  report: DiagnosisReport;
}

export const CeoRadarDiagram: React.FC<CeoRadarDiagramProps> = ({ report }) => {
  const profile = report.profile;
  const healthScore = report.healthScore ?? 68;

  // 10 Trục chuẩn theo Hình 2 đính kèm của người dùng
  const axes = [
    {
      id: 1,
      category: 'Giá trị',
      label: '(1) USP có khác biệt?',
      score: 4.5,
      benchmark: 4.0,
      note: 'Sản phẩm cốt lõi chất lượng cao, có hương vị và uy tín thực tế.',
      isLeak: false,
    },
    {
      id: 2,
      category: 'Khách hàng',
      label: '(2) Nhóm tạo lợi nhuận lớn?',
      score: 3.5,
      benchmark: 4.2,
      note: 'Biết tệp khách quen nhưng chưa đo lường chính xác tỷ trọng lợi nhuận đóng góp.',
      isLeak: true,
    },
    {
      id: 3,
      category: 'Khách hàng',
      label: '(3) Hiểu rõ Pain Point/Insight?',
      score: 4.0,
      benchmark: 4.0,
      note: 'Thấu hiểu nhu cầu bữa ăn an toàn, vị truyền thống.',
      isLeak: false,
    },
    {
      id: 4,
      category: 'Tiếp cận',
      label: '(4) Khách dễ tìm thấy?',
      score: 2.2,
      benchmark: 4.0,
      note: 'Hiện diện số mờ nhạt, khách ngoài vùng lõi khó tiếp cận trực tiếp.',
      isLeak: true,
    },
    {
      id: 5,
      category: 'Tiếp cận',
      label: '(5) Internet → Doanh thu?',
      score: 2.0,
      benchmark: 4.0,
      note: 'Có website/Zalo nhưng chưa có phễu chuyển đổi tự động ra đơn hàng.',
      isLeak: true,
    },
    {
      id: 6,
      category: 'Giữ chân',
      label: '(6) Có cơ chế mua lại?',
      score: 2.0,
      benchmark: 3.8,
      note: 'Khách mua xong không có chu kỳ nhắc nhở tự động, tiền bị rơi rụng ở đây.',
      isLeak: true,
    },
    {
      id: 7,
      category: 'Giữ chân',
      label: '(7) Chiến lược Cross/Upsell?',
      score: 2.5,
      benchmark: 3.8,
      note: 'Chủ yếu bán chai đơn lẻ, chưa đóng gói combo quà biếu hay sản phẩm phụ.',
      isLeak: true,
    },
    {
      id: 8,
      category: 'Dữ liệu',
      label: '(8) Khai thác dữ liệu khách?',
      score: 1.5,
      benchmark: 3.8,
      note: 'Không có CRM, thông tin khách hàng nằm rải rác sổ sách và Zalo cá nhân.',
      isLeak: true,
    },
    {
      id: 9,
      category: 'Vận hành',
      label: '(9) Tăng thu không tăng nhân sự?',
      score: 3.0,
      benchmark: 3.5,
      note: 'Quy trình tư vấn phụ thuộc con người, tăng đơn là quá tải nhân viên.',
      isLeak: true,
    },
    {
      id: 10,
      category: 'Mở rộng',
      label: '(10) Dễ dàng nhân bản?',
      score: 2.8,
      benchmark: 4.0,
      note: 'Chưa đóng gói thành mô hình chuỗi hay hệ sinh thái dễ chuyển giao.',
      isLeak: true,
    },
  ];

  // Tọa độ Radar SVG (Tâm cx=360, cy=300, radius=185 trên viewBox 0 0 720 600)
  const cx = 360;
  const cy = 300;
  const maxR = 175;
  const numAxes = 10;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2;

  const getCoordinates = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 5) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const currentPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.score);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const benchmarkPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.benchmark);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-10 space-y-8 font-sans">
      
      {/* 1. HEADER CHUẨN AUDIT NHƯ HÌNH 2 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span>02. CHẨN ĐOÁN SỨC KHỎE TỔNG THỂ • 10 TRỤC NĂNG LỰC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            CEO Health Check — Radar Đo Lường Doanh Nghiệp
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Doanh nghiệp: <strong className="text-slate-900">{profile.businessName}</strong> • CEO: <strong className="text-slate-800">{profile.ceoName || 'Lãnh đạo'}</strong> • Điểm tổng quát: <strong className="text-blue-600">{healthScore}/100</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600"></span>
            <span className="text-slate-800">Hiện tại của DN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-blue-600"></span>
            <span className="text-slate-800">Chuẩn ngành</span>
          </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ RADAR SVG CHÍNH XÁC */}
      <div className="relative w-full overflow-x-auto flex justify-center py-2">
        <div className="w-[700px] max-w-full shrink-0 relative">
          
          <svg viewBox="0 0 720 600" className="w-full h-auto select-none">
            
            {/* 5 Vòng tròn đồng tâm (1 đến 5) */}
            {[1, 2, 3, 4, 5].map((level) => {
              const r = (level / 5) * maxR;
              return (
                <g key={level}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={level % 2 === 0 ? '#f8fafc' : '#ffffff'}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray={level === 5 ? 'none' : '2 2'}
                  />
                  <text
                    x={cx + 6}
                    y={cy - r + 11}
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#94a3b8"
                  >
                    {level} {level === 5 ? '(Rất tốt)' : level === 4 ? '(Tốt)' : level === 3 ? '(TB)' : level === 2 ? '(Yếu)' : '(Rất yếu)'}
                  </text>
                </g>
              );
            })}

            {/* 10 Trục từ tâm */}
            {axes.map((_, i) => {
              const angle = startAngle + i * angleStep;
              const x2 = cx + maxR * Math.cos(angle);
              const y2 = cy + maxR * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Đa giác Chuẩn ngành (Xanh) */}
            <polygon
              points={benchmarkPoints}
              fill="rgba(59, 130, 246, 0.16)"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Đa giác Doanh nghiệp (Cam) */}
            <polygon
              points={currentPoints}
              fill="rgba(245, 158, 11, 0.35)"
              stroke="#d97706"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Điểm nút */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(i, axis.score);
              return (
                <g key={`point-${i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#d97706"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y + 3}
                    fontSize="7"
                    fontWeight="900"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {axis.score.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Nhãn 10 trục */}
            {axes.map((axis, i) => {
              const angle = startAngle + i * angleStep;
              const labelR = maxR + 26;
              const lx = cx + labelR * Math.cos(angle);
              const ly = cy + labelR * Math.sin(angle);

              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (Math.cos(angle) > 0.25) textAnchor = 'start';
              if (Math.cos(angle) < -0.25) textAnchor = 'end';

              return (
                <g key={`label-${i}`}>
                  <text
                    x={lx}
                    y={ly + 4}
                    fontSize="11.5"
                    fontWeight="800"
                    fill={axis.isLeak ? '#b91c1c' : '#1e293b'}
                    textAnchor={textAnchor}
                    className="select-none font-sans"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

          </svg>

          {/* Callout cảnh báo rò rỉ */}
          <div className="mt-3 sm:mt-0 sm:absolute bottom-1 right-1 bg-slate-900 text-white p-4 rounded-2xl shadow-xl max-w-xs border border-slate-700 space-y-1">
            <div className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CẢNH BÁO RÒ RỈ DÒNG TIỀN</span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              Điểm số thấp ở bất kỳ trục nào cũng chỉ ra một vị trí rò rỉ dòng tiền mặt cần bịt lại.
            </p>
          </div>

        </div>
      </div>

      {/* 3. BẢNG 10 TRỤC NĂNG LỰC */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            10 Năng Lực Trọng Tâm &amp; Điểm Nghẽn Rò Rỉ
          </h3>
          <span className="text-xs text-slate-500 font-medium">Thang điểm 1 - 5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {axes.map((axis) => (
            <div
              key={axis.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                axis.isLeak
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <span className="text-xs font-black tracking-tight">{axis.label}</span>
                <div className="flex items-center gap-2">
                  {axis.isLeak && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      ⚠️ RÒ RỈ
                    </span>
                  )}
                  <span className="text-xs font-black text-blue-700">
                    {axis.score}/5
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (Chuẩn: {axis.benchmark})
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden my-1.5 flex">
                <div
                  className={`h-full rounded-full ${axis.isLeak ? 'bg-rose-500' : 'bg-blue-600'}`}
                  style={{ width: `${(axis.score / 5) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {axis.note}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
