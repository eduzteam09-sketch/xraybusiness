import React from 'react';
import { Stethoscope, Building2, User, ChevronDown, Printer, ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react';
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
      className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs"
    >
      {/* Left: Brand when in Home, or Business Info when in Results */}
      <div className="flex items-center gap-3">
        {viewMode === 'results' && onBackToHome && (
          <button
            onClick={onBackToHome}
            title="Quay lại Trang Chủ giới thiệu"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về Trang Chủ</span>
          </button>
        )}

        {viewMode === 'home' ? (
          // Khi ở Trang Chủ: Hiển thị thương hiệu ứng dụng, KHÔNG hiển thị kết quả nào
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              AI
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>AI BUSINESS HEALTH CHECK</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  2026
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Hệ Thống Chẩn Đoán Sức Khỏe &amp; Định Vị Chiến Lược Doanh Nghiệp
              </div>
            </div>
          </div>
        ) : (
          // Khi ở màn hình Kết quả: Hiển thị hồ sơ doanh nghiệp đã khám
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
              <User className="w-4.5 h-4.5 text-blue-700" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Hồ sơ: <span className="text-blue-700">{profile.businessName || 'Doanh nghiệp'}</span>
                </span>
                {healthScore !== undefined && (
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Sức khỏe: {healthScore}/100
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>CEO: <strong className="text-slate-800">{profile.ceoName || 'Chủ doanh nghiệp'}</strong></span>
                <span>• Ngành: <strong className="text-slate-700">{profile.industry}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sample selector: Only visible in results view or quick switch */}
        {viewMode === 'results' && (
          <div className="relative inline-block text-left">
            <select
              id="sample-business-select"
              aria-label="Chọn mẫu doanh nghiệp thực tế"
              value={profile.id}
              onChange={(e) => onSelectSample(e.target.value)}
              className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 pr-7 cursor-pointer appearance-none transition-colors"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Xem Kết Quả Mẫu</span>
          </button>
        )}

        {viewMode === 'results' && onPrintReport && (
          <button
            id="header-print-btn"
            onClick={onPrintReport}
            title="In / Xuất Báo Cáo Chiến Lược"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Xuất Báo Cáo</span>
          </button>
        )}

        <button
          id="header-new-checkup-btn"
          onClick={onStartNewCheckup}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs hover:scale-[1.02]"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Bắt Đầu Khám</span>
        </button>
      </div>
    </header>
  );
};
