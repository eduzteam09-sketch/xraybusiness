import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Grid,
  AlertTriangle,
  CalendarCheck2,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export type NavTab =
  | 'differentiation'
  | 'overview'
  | 'canvas'
  | 'bottlenecks'
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
  onBackToHome,
  onStartNewCheckup,
}) => {
  const navItems = [
    {
      id: 'differentiation' as NavTab,
      label: '01. Giá Trị & Khác Biệt',
      sub: 'Định vị thị trường & 5 khía cạnh độc nhất',
      icon: Compass,
    },
    {
      id: 'overview' as NavTab,
      label: '02. Radar Sức Khỏe Tổng',
      sub: '10 Trục sức khỏe & chuẩn benchmark ngành',
      icon: LayoutDashboard,
    },
    {
      id: 'canvas' as NavTab,
      label: '03. Mô Hình Canvas 9 Ô',
      sub: 'Bento 9 khối liên minh & hệ sinh thái',
      icon: Grid,
    },
    {
      id: 'bottlenecks' as NavTab,
      label: '04. Bản Đồ Điểm Nghẽn',
      sub: '5 Zone rò rỉ dòng tiền & gốc rễ',
      icon: AlertTriangle,
      badge: 'Trọng tâm',
    },
    {
      id: 'action_plan' as NavTab,
      label: '05. Giải Pháp & Lộ Trình 90N',
      sub: 'Re-purchase Engine & 5 KPI bứt phá',
      icon: CalendarCheck2,
    },
    {
      id: 'report' as NavTab,
      label: '06. Báo Cáo CEO & Email',
      sub: 'Tải PDF Vector A4 & Chuyển phát mail',
      icon: FileSpreadsheet,
      highlight: true,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="app-desktop-sidebar"
        className="hidden md:flex flex-col w-72 bg-white text-slate-800 border-r border-slate-200/90 h-screen sticky top-0 shrink-0 select-none shadow-xs"
      >
        {/* Brand & Back Button */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                AI
              </div>
              <div>
                <div className="font-black text-xs text-slate-900 tracking-tight">KẾT QUẢ CHIẾN LƯỢC</div>
                <div className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wide">
                  6 Sơ Đồ Trực Quan
                </div>
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
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 hover:scale-[1.01]"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Khám Doanh Nghiệp Mới</span>
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Bản đồ kết quả điều hành
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 font-extrabold border-l-4 border-blue-600 shadow-2xs'
                    : item.highlight
                    ? 'bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-blue-600'
                      : item.highlight
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs truncate ${item.highlight && !isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive
                        ? 'text-blue-600 font-medium'
                        : item.highlight
                        ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-slate-500">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-[11px] space-y-1">
            <div className="font-extrabold text-slate-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI-First Executive Suite</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              Tối giản chữ • Trực quan hóa 100% dữ liệu để CEO ra quyết định tức thì.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
