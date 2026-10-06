import React from 'react';
import {
  Building2,
  User,
  ChevronDown,
  ArrowLeft,
  LayoutDashboard,
  Download,
  Mail,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { SAMPLE_PROFILES_LIST } from '../data/sampleProfiles';

interface HeaderProps {
  profile: BusinessProfile;
  healthScore?: number;
  viewMode: 'home' | 'checkup' | 'results';
  onSelectSample: (profileId: string) => void;
  onStartNewCheckup: () => void;
  onPrintReport?: () => void;
  onBackToHome?: () => void;
  onExploreResults?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  healthScore,
  viewMode,
  onSelectSample,
  onStartNewCheckup,
  onPrintReport,
  onBackToHome,
  onExploreResults,
}) => {
  return (
    <header
      id="app-main-header"
      className="bg-white border-b border-slate-200/90 px-3 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95"
    >
      {/* Left: Brand when in Home, or Business Info when in Results */}
      <div className="flex items-center gap-3 min-w-0">
        {viewMode === 'results' && onBackToHome && (
          <button
            onClick={onBackToHome}
            title="Quay lại Trang Chủ"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trang Chủ</span>
          </button>
        )}

        {viewMode === 'home' ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
              AI
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>AI BUSINESS HEALTH CHECKUP</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  2026
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Hệ Thống Chẩn Đoán Sức Khỏe &amp; Định Vị Chiến Lược 90 Ngày Cho CEO
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
              <Building2 className="w-4 h-4 text-blue-700" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                  {profile.businessName || 'Doanh Nghiệp'}
                </span>
                {healthScore !== undefined && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Sức Khỏe: {healthScore}/100
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span>CEO: <strong className="text-slate-800">{profile.ceoName || 'Lãnh đạo'}</strong></span>
                <span>• {profile.industry}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 justify-end">
        {/* Sample selector in results view */}
        {viewMode === 'results' && (
          <div className="relative inline-block text-left">
            <select
              id="sample-business-select"
              aria-label="Chọn mẫu doanh nghiệp thực tế"
              value={profile.id}
              onChange={(e) => onSelectSample(e.target.value)}
              className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 pr-7 cursor-pointer appearance-none transition-colors"
            >
              {SAMPLE_PROFILES_LIST.map((sample) => (
                <option key={sample.profile.id} value={sample.profile.id}>
                  Mẫu: {sample.profile.businessName}
                </option>
              ))}
              <option value="new-custom">+ Khám doanh nghiệp mới</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {viewMode === 'home' && onExploreResults && (
          <button
            id="header-explore-sample-btn"
            onClick={onExploreResults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Xem Kết Quả Mẫu</span>
          </button>
        )}

        {viewMode === 'results' && onPrintReport && (
          <button
            id="header-print-btn"
            onClick={onPrintReport}
            title="Xem Báo Cáo Chiến Lược CEO (Tải PDF & Gửi Email)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Báo Cáo PDF / Mail</span>
            <span className="sm:hidden">PDF/Mail</span>
          </button>
        )}

        <button
          id="header-new-checkup-btn"
          onClick={onStartNewCheckup}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Khám Mới</span>
        </button>
      </div>
    </header>
  );
};
