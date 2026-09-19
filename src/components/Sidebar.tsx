import React from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  Compass,
  Grid,
  AlertTriangle,
  Coins,
  Lightbulb,
  Cpu,
  CalendarCheck2,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'checkup'
  | 'positioning'
  | 'canvas'
  | 'bottlenecks'
  | 'moneyflow'
  | 'opportunities'
  | 'digital_ai'
  | 'action_plan'
  | 'report';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasDiagnosis: boolean;
  onBackToHome?: () => void;
  onStartNewCheckup?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hasDiagnosis,
  onBackToHome,
  onStartNewCheckup,
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: '01. Tổng quan chẩn đoán', sub: 'Chỉ số sức khỏe & đòn bẩy', icon: LayoutDashboard },
    { id: 'positioning' as NavTab, label: '02. Vị thế & Khác biệt', sub: 'Bằng chứng & Khách hàng', icon: Compass },
    { id: 'canvas' as NavTab, label: '03. Mô hình Canvas 9 ô', sub: '3 lớp: Hiện trạng & AI', icon: Grid },
    { id: 'bottlenecks' as NavTab, label: '04. Bản đồ 5 Zone Nghẽn', sub: 'Vị trí rò rỉ dòng tiền', icon: AlertTriangle, badge: 'Ưu tiên' },
    { id: 'moneyflow' as NavTab, label: '05. Quản trị dòng tiền', sub: 'Mở thêm dòng tiền mới', icon: Coins },
    { id: 'opportunities' as NavTab, label: '06. Khoảng trống & Cơ hội', sub: 'Tệp khách & Sản phẩm phụ', icon: Lightbulb },
    { id: 'digital_ai' as NavTab, label: '07. Số hóa & Ứng dụng AI', sub: '3 việc AI làm ngay lập tức', icon: Cpu },
    { id: 'action_plan' as NavTab, label: '08. Lộ trình CEO 90 ngày', sub: '3-5 việc có đòn bẩy cao', icon: CalendarCheck2 },
    { id: 'report' as NavTab, label: '09. Báo cáo chiến lược CEO', sub: 'Xuất PDF & Gửi Email', icon: FileSpreadsheet, highlight: true },
  ];

  return (
    <>
      {/* Desktop Sidebar - Nền sáng, hiện đại, viền sắc nét */}
      <aside 
        id="app-desktop-sidebar"
        className="hidden md:flex flex-col w-72 bg-white text-slate-800 border-r border-slate-200 h-screen sticky top-0 shrink-0 select-none shadow-xs"
      >
        {/* Brand & Back Button */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                AI
              </div>
              <div>
                <div className="font-black text-xs text-slate-900 tracking-wide">BẢN ĐỒ KẾT QUẢ</div>
                <div className="text-[10px] text-blue-600 font-bold">Business Health Check</div>
              </div>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                title="Quay lại Trang Chủ giới thiệu"
                className="text-[11px] font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Trang Chủ</span>
              </button>
            )}
          </div>

          {/* Quick new checkup button */}
          {onStartNewCheckup && (
            <button
              onClick={onStartNewCheckup}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 hover:scale-[1.01]"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Khám Doanh Nghiệp Mới</span>
            </button>
          )}
        </div>

        {/* Navigation List - Tone màu sáng, thanh lịch */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Danh mục kết quả chẩn đoán
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-600 shadow-2xs'
                    : item.highlight
                    ? 'bg-amber-50/70 text-amber-900 hover:bg-amber-100/70 border border-amber-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : item.highlight ? 'text-amber-600' : 'text-slate-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    {item.sub}
                  </div>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 text-slate-500">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 uppercase">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Tư duy cốt lõi
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
            “Người dùng không cần hiểu công cụ. AI phải hiểu công cụ thay người dùng.”
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Tone sáng) */}
      <nav 
        id="app-mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg text-slate-600"
      >
        <button
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] ${
            currentTab === 'overview' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => onSelectTab('bottlenecks')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] ${
            currentTab === 'bottlenecks' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Điểm nghẽn</span>
        </button>

        <button
          onClick={() => onSelectTab('moneyflow')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] ${
            currentTab === 'moneyflow' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Dòng tiền</span>
        </button>

        <button
          onClick={() => onSelectTab('action_plan')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] ${
            currentTab === 'action_plan' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Kế hoạch</span>
        </button>

        <button
          onClick={() => onSelectTab('report')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] ${
            currentTab === 'report' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Báo cáo</span>
        </button>
      </nav>
    </>
  );
};
