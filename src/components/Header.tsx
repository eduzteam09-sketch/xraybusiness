import React from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Download,
  Compass,
  Grid,
  AlertTriangle,
  CalendarCheck2,
  FileSpreadsheet,
  Crown,
  Sparkles,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  profile: BusinessProfile;
  healthScore?: number;
  viewMode: 'home' | 'checkup' | 'results';
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onSelectSample?: (profileId: string) => void;
  onStartNewCheckup?: () => void;
  onPrintReport?: () => void;
  onBackToHome?: () => void;
  onExploreResults?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  healthScore = 72,
  viewMode,
  currentTab = 'differentiation',
  onSelectTab,
  onPrintReport,
  onBackToHome,
}) => {
  const navItems = [
    {
      id: 'differentiation' as NavTab,
      label: 'Vị Thế & Khác Biệt',
      shortLabel: '1. Vị Thế',
      icon: Compass,
      badge: null,
    },
    {
      id: 'overview' as NavTab,
      label: 'Radar Sức Khỏe',
      shortLabel: '2. Radar',
      icon: LayoutDashboard,
      badge: `${healthScore}`,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'canvas' as NavTab,
      label: 'Canvas 9 Khối',
      shortLabel: '3. Canvas',
      icon: Grid,
      badge: null,
    },
    {
      id: 'bottlenecks' as NavTab,
      label: 'Bản Đồ 5 Zone',
      shortLabel: '4. 5 Zone',
      icon: AlertTriangle,
      badge: '3',
      badgeColor: 'bg-rose-600 text-white animate-pulse',
    },
    {
      id: 'action_plan' as NavTab,
      label: 'Quick Win 90N',
      shortLabel: '5. 90 Ngày',
      icon: CalendarCheck2,
      badge: null,
    },
    {
      id: 'report' as NavTab,
      label: 'Báo Cáo CEO & PDF',
      shortLabel: '6. Báo Cáo',
      icon: FileSpreadsheet,
      badge: 'A4',
      badgeColor: 'bg-amber-400 text-slate-900',
    },
  ];

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-300 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <header className="sticky top-0 z-40 select-none shadow-md">
      {/* 1. TOP NAVY EXECUTIVE BAR */}
      <div className="bg-[#0b132b] text-white border-b border-slate-800/90 px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand Identity & Company Info */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {viewMode === 'results' && onBackToHome && (
              <button
                onClick={onBackToHome}
                title="Quay lại Trang Chủ"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Logo Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/30">
              AI
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-white tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {viewMode === 'results' ? profile.businessName : 'AI Business Health Checkup'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="hidden xs:inline">CEO COMMAND 2026</span>
                  <span className="xs:hidden">2026</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                {viewMode === 'results'
                  ? `CEO: ${profile.ceoName || 'Lãnh đạo'} • Ngành: ${profile.industry} • Điều hành chẩn đoán 10 trục`
                  : 'Hệ Thống Chẩn Đoán Sức Khỏe & Bản Đồ Điểm Nghẽn Doanh Nghiệp'}
              </div>
            </div>
          </div>

          {/* Right: Adjusted Controls (No Sample button, No New Checkup button, No Send Email button) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {viewMode === 'results' ? (
              <>
                {/* Health Score Pill */}
                <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${getScoreBadgeColor(healthScore)}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase">Sức Khỏe:</span>
                  <span className="font-display font-black text-sm">{healthScore}</span>
                  <span className="text-[10px] opacity-75">/100</span>
                </div>

                {/* Direct PDF Download Action */}
                {onPrintReport && (
                  <button
                    id="header-download-pdf-btn"
                    onClick={onPrintReport}
                    title="Xuất Báo Cáo PDF A4"
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:scale-[1.02] cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-900" />
                    <span>Xuất Báo Cáo PDF</span>
                  </button>
                )}
              </>
            ) : (
              /* Home View Status Chip */
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Chuẩn Doanh Nghiệp 2026</span>
                <span className="sm:hidden">Online</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. SUB-HEADER FLOATING NAVIGATION PILL (TABLET & MOBILE OPTIMIZED) */}
      {viewMode === 'results' && (
        <div className="bg-[#0b132b]/95 backdrop-blur-md py-2 px-2 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto flex items-center justify-center">
            <div className="w-full sm:w-auto bg-white/95 backdrop-blur-sm rounded-2xl p-1 sm:p-1.5 shadow-xl border border-slate-200/90 flex items-center gap-1 overflow-x-auto scrollbar-none snap-x touch-pan-x">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab && onSelectTab(item.id)}
                    className={`whitespace-nowrap px-2.5 sm:px-4 py-2 rounded-xl text-xs transition-all shrink-0 flex items-center gap-1.5 sm:gap-2 cursor-pointer snap-start ${
                      isActive
                        ? 'bg-[#0b132b] text-white shadow-md scale-[1.02] font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="hidden md:inline">{item.label}</span>
                    <span className="md:hidden">{item.shortLabel}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                          item.badgeColor || (isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
