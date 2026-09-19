import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingHome } from './components/LandingHome';
import { HomeOverview } from './components/HomeOverview';
import { CheckupInterview } from './components/CheckupInterview';
import { CanvasLiving } from './components/CanvasLiving';
import { BottleneckMap } from './components/BottleneckMap';
import { PositioningDifferentiation } from './components/PositioningDifferentiation';
import { MoneyFlowView } from './components/MoneyFlowView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { DigitalAIView } from './components/DigitalAIView';
import { ActionPlan90DaysView } from './components/ActionPlan90DaysView';
import { CeoReportView } from './components/CeoReportView';
import { BusinessProfile, DiagnosisReport } from './types';
import { HAI_HUONG_PROFILE, SAMPLE_PROFILES_LIST } from './data/sampleProfiles';
import { Building2, ArrowRight, X, Sparkles } from 'lucide-react';

export type ViewMode = 'home' | 'checkup' | 'results';

export default function App() {
  // Navigation & View Mode State
  // Khi người dùng vào ban đầu:
  // - Hoàn toàn không cần đăng nhập
  // - KHÔNG thấy bất kỳ kết quả nào ở màn hình
  // - Chỉ là thông tin giới thiệu về ứng dụng, hướng dẫn sử dụng, giá trị mang lại
  // - 1 nút xem bản đồ kết quả mẫu
  // - 1 nút bắt đầu khám doanh nghiệp
  // - KHÔNG hiện menu bên trái (Menu chỉ hiện khi có kết quả)
  // - Tone màu sáng, hiện đại, thanh lịch
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [activeReport, setActiveReport] = useState<DiagnosisReport>(HAI_HUONG_PROFILE);
  const [isNewBusinessModalOpen, setIsNewBusinessModalOpen] = useState<boolean>(false);

  // Form state for creating a new custom business checkup
  const [newBizForm, setNewBizForm] = useState<{
    ceoName: string;
    businessName: string;
    industry: string;
  }>({
    ceoName: '',
    businessName: '',
    industry: '',
  });

  // Load saved custom report from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_business_checkup_active_report');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          setActiveReport(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load saved report from localStorage:', e);
    }
  }, []);

  // Save active report to localStorage on change
  const updateActiveReport = (report: DiagnosisReport) => {
    setActiveReport(report);
    try {
      localStorage.setItem('ai_business_checkup_active_report', JSON.stringify(report));
    } catch (e) {
      console.warn('Could not persist report:', e);
    }
  };

  const handleSelectSample = (profileId: string) => {
    if (profileId === 'new-custom') {
      setIsNewBusinessModalOpen(true);
      return;
    }

    const found = SAMPLE_PROFILES_LIST.find((s) => s.profile.id === profileId);
    if (found) {
      updateActiveReport(found);
    }
  };

  const handleStartNewCheckup = () => {
    setIsNewBusinessModalOpen(true);
  };

  const handleConfirmNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizForm.businessName.trim()) return;

    const newProfile: BusinessProfile = {
      id: `biz-${Date.now()}`,
      ceoName: newBizForm.ceoName.trim() || 'CEO',
      businessName: newBizForm.businessName.trim(),
      industry: newBizForm.industry.trim() || 'Kinh doanh & Dịch vụ',
      currentTools: ['Zalo', 'Excel'],
      createdAt: new Date().toISOString(),
    };

    const tempReport: DiagnosisReport = {
      ...HAI_HUONG_PROFILE,
      id: `diag-temp-${Date.now()}`,
      profile: newProfile,
      createdAt: new Date().toISOString(),
    };

    updateActiveReport(tempReport);
    setIsNewBusinessModalOpen(false);
    setViewMode('checkup');
  };

  const handleDiagnosisComplete = (completedReport: DiagnosisReport) => {
    updateActiveReport(completedReport);
    // Menu bên trái chỉ hiển thị khi có kết quả
    setViewMode('results');
    setCurrentTab('overview');
  };

  const handleUpdatePlanStatus = (planId: string, status: 'done' | 'doing' | 'todo') => {
    if (!activeReport) return;
    const updatedPlans = activeReport.ninetyDayPlan.map((p) =>
      p.id === planId ? { ...p, status } : p
    );
    updateActiveReport({ ...activeReport, ninetyDayPlan: updatedPlans });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* 
        CRITICAL REQUIREMENT:
        - Ở màn hình TRANG CHỦ (home) và màn hình KHÁM DOANH NGHIỆP (checkup):
          ĐỀU KHÔNG HIỆN MENU BÊN TRÁI.
        - Menu bên trái CHỈ HIỂN THỊ KHI CÓ KẾT QUẢ (viewMode === 'results').
        - Nền Menu màu sáng, thanh lịch, KHÔNG DÙNG NỀN ĐEN.
      */}
      {viewMode === 'results' && (
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          hasDiagnosis={Boolean(activeReport)}
          onBackToHome={() => setViewMode('home')}
          onStartNewCheckup={() => setViewMode('checkup')}
        />
      )}

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Header is shown on Home and Results, hidden during focused Checkup */}
        {viewMode !== 'checkup' && (
          <Header
            profile={activeReport.profile}
            healthScore={activeReport?.healthScore}
            viewMode={viewMode}
            onSelectSample={handleSelectSample}
            onStartNewCheckup={handleStartNewCheckup}
            onPrintReport={() => {
              setViewMode('results');
              setCurrentTab('report');
            }}
            onBackToHome={() => setViewMode('home')}
            onExploreResults={() => {
              setViewMode('results');
              setCurrentTab('overview');
            }}
          />
        )}

        {/* Content Display based on ViewMode */}
        <main className="flex-1">
          {/* 
            1. MÀN HÌNH TRANG CHỦ (LANDING HOME):
            - FULL MÀN HÌNH, KHÔNG CÓ MENU BÊN TRÁI.
            - KHÔNG THẤY BẤT KỲ KẾT QUẢ NÀO CỦA DOANH NGHIỆP.
            - Chỉ giới thiệu ứng dụng, hướng dẫn sử dụng, giá trị mang lại.
            - Có 1 nút để xem bản đồ kết quả mẫu.
            - Có nút chính "BẮT ĐẦU KHÁM DOANH NGHIỆP".
            - Tone màu sáng, hiện đại, không dùng nền đen.
          */}
          {viewMode === 'home' && (
            <LandingHome
              onStartCheckup={handleStartNewCheckup}
              onExploreSample={() => {
                setViewMode('results');
                setCurrentTab('overview');
              }}
            />
          )}

          {/* 
            2. MÀN HÌNH KHÁM DOANH NGHIỆP:
            - FULL MÀN HÌNH, KHÔNG CÓ MENU BÊN TRÁI.
            - Phỏng vấn chuyên sâu 1-1 qua giọng nói hoặc bấm chọn nhanh.
          */}
          {viewMode === 'checkup' && (
            <CheckupInterview
              initialProfile={activeReport.profile}
              onDiagnosisComplete={handleDiagnosisComplete}
              onCancel={() => setViewMode('home')}
            />
          )}

          {/* 
            3. MÀN HÌNH KẾT QUẢ:
            - MENU BÊN TRÁI HIỆN RA VỚI ĐỦ 9 HẠNG MỤC CHẨN ĐOÁN.
            - Xem chi tiết bản đồ doanh nghiệp.
          */}
          {viewMode === 'results' && (
            <>
              {/* Mobile Horizontal Module Switcher (Hiển thị trọn vẹn 9 tab trên màn hình di động) */}
              <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none sticky top-14 z-20 shadow-2xs">
                {[
                  { id: 'overview' as NavTab, label: '01. Tổng quan' },
                  { id: 'positioning' as NavTab, label: '02. Vị thế' },
                  { id: 'canvas' as NavTab, label: '03. Canvas 9 ô' },
                  { id: 'bottlenecks' as NavTab, label: '04. 5 Zone Nghẽn', isHot: true },
                  { id: 'moneyflow' as NavTab, label: '05. Dòng tiền' },
                  { id: 'opportunities' as NavTab, label: '06. Cơ hội' },
                  { id: 'digital_ai' as NavTab, label: '07. Số hóa & AI' },
                  { id: 'action_plan' as NavTab, label: '08. Kế hoạch 90N' },
                  { id: 'report' as NavTab, label: '09. Báo cáo CEO', isSpecial: true },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      currentTab === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : item.isSpecial
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.isHot
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {currentTab === 'overview' && (
                <HomeOverview
                  report={activeReport}
                  onStartCheckup={handleStartNewCheckup}
                  onNavigateToTab={(tab) => setCurrentTab(tab as NavTab)}
                />
              )}

              {currentTab === 'positioning' && (
                <PositioningDifferentiation report={activeReport} />
              )}

              {currentTab === 'canvas' && (
                <CanvasLiving
                  canvas={activeReport.canvas}
                  businessName={activeReport.profile.businessName}
                />
              )}

              {currentTab === 'bottlenecks' && <BottleneckMap report={activeReport} />}

              {currentTab === 'moneyflow' && <MoneyFlowView report={activeReport} />}

              {currentTab === 'opportunities' && <OpportunitiesView report={activeReport} />}

              {currentTab === 'digital_ai' && <DigitalAIView report={activeReport} />}

              {currentTab === 'action_plan' && (
                <ActionPlan90DaysView
                  report={activeReport}
                  onUpdatePlanStatus={handleUpdatePlanStatus}
                />
              )}

              {currentTab === 'report' && (
                <CeoReportView
                  report={activeReport}
                  onBackToOverview={() => setCurrentTab('overview')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal: Khởi tạo doanh nghiệp mới để khám (Tone sáng, hiện đại) */}
      {isNewBusinessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">KHÁM DOANH NGHIỆP CỦA BẠN</h3>
                  <p className="text-xs text-slate-500">Nhập 3 thông tin cơ bản để bắt đầu</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewBusinessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmNewBusiness} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tên của bạn (CEO / Chủ doanh nghiệp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBizForm.ceoName}
                  onChange={(e) => setNewBizForm({ ...newBizForm, ceoName: e.target.value })}
                  placeholder="Ví dụ: Anh Hoàng / Chị Mai"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tên doanh nghiệp / Cơ sở kinh doanh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBizForm.businessName}
                  onChange={(e) => setNewBizForm({ ...newBizForm, businessName: e.target.value })}
                  placeholder="Ví dụ: Chuỗi Thời Trang An Bình, Nhà Thuốc Tâm An..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ngành nghề / Lĩnh vực hoạt động
                </label>
                <input
                  type="text"
                  value={newBizForm.industry}
                  onChange={(e) => setNewBizForm({ ...newBizForm, industry: e.target.value })}
                  placeholder="Ví dụ: Sản xuất thực phẩm, Dịch vụ F&B, Bán lẻ mỹ phẩm..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Không cần mật khẩu hay đăng ký tài khoản. Kết quả được lưu trên thiết bị của bạn.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBusinessModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-xs hover:scale-[1.02] transition-all"
                >
                  <span>Bắt đầu phỏng vấn AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
