import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHome } from './components/LandingHome';
import { CheckupInterview } from './components/CheckupInterview';
import { CeoRadarDiagram } from './components/CeoRadarDiagram';
import { PositioningDifferentiation } from './components/PositioningDifferentiation';
import { CanvasDiagramView } from './components/CanvasDiagramView';
import { BottleneckDiagramView } from './components/BottleneckDiagramView';
import { QuickWin90DaysView } from './components/QuickWin90DaysView';
import { CeoReportView } from './components/CeoReportView';
import { BusinessProfile, DiagnosisReport } from './types';
import { HAI_HUONG_PROFILE, SAMPLE_PROFILES_LIST } from './data/sampleProfiles';
import { NavTab } from './components/Sidebar';
import { Building2, X } from 'lucide-react';

export type ViewMode = 'home' | 'checkup' | 'results';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentTab, setCurrentTab] = useState<NavTab>('differentiation');
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
    industry: 'Sản xuất thực phẩm & Đồ uống (F&B)',
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

    // Luôn tải chính xác hồ sơ chuẩn Nước Mắm Hải Hương
    updateActiveReport(HAI_HUONG_PROFILE);
    setViewMode('results');
    setCurrentTab('differentiation');
  };

  const handleStartNewCheckupFromLanding = (formData?: {
    ceoName: string;
    email?: string;
    businessName: string;
    industry: string;
  }) => {
    if (formData && formData.businessName.trim()) {
      const newProfile: BusinessProfile = {
        id: `biz-${Date.now()}`,
        ceoName: formData.ceoName.trim() || 'CEO',
        businessName: formData.businessName.trim(),
        industry: formData.industry.trim() || 'Kinh doanh & Dịch vụ',
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
      setViewMode('checkup');
      return;
    }

    setIsNewBusinessModalOpen(true);
  };

  const handleExploreSampleFromLanding = (profileId?: string) => {
    // Luôn tải chính xác hồ sơ chuẩn Nước Mắm Hải Hương
    updateActiveReport(HAI_HUONG_PROFILE);
    setViewMode('results');
    setCurrentTab('differentiation');
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
    setViewMode('results');
    setCurrentTab('differentiation');
  };

  const healthScore = activeReport.healthScore ?? 72;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. TOP HEADER ĐIỀU HÀNH EXECUTIVE */}
      {viewMode !== 'checkup' && (
        <Header
          profile={activeReport.profile}
          healthScore={healthScore}
          viewMode={viewMode}
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onSelectSample={handleSelectSample}
          onStartNewCheckup={() => setIsNewBusinessModalOpen(true)}
          onPrintReport={() => {
            setViewMode('results');
            setCurrentTab('report');
          }}
          onBackToHome={() => setViewMode('home')}
          onExploreResults={() => {
            setViewMode('results');
            setCurrentTab('differentiation');
          }}
        />
      )}

      {/* Main Container */}
      <main className="flex-1">
        {/* 1. MÀN HÌNH ĐÓN TIẾP & NHẬP THÔNG TIN CEO (LANDING INTAKE) */}
        {viewMode === 'home' && (
          <LandingHome
            onStartCheckup={handleStartNewCheckupFromLanding}
            onExploreSample={handleExploreSampleFromLanding}
          />
        )}

        {/* 2. MÀN HÌNH PHỎNG VẤN CHẨN ĐOÁN (CHECKUP INTERVIEW) */}
        {viewMode === 'checkup' && (
          <CheckupInterview
            initialProfile={activeReport.profile}
            onDiagnosisComplete={handleDiagnosisComplete}
            onCancel={() => setViewMode('home')}
          />
        )}

        {/* 3. MÀN HÌNH DASHBOARD ĐỒ HỌA KẾT QUẢ CHIẾN LƯỢC: TOÀN BỘ TAB ĐƯỢC MỞ RỘNG TOÀN CHIỀU NGANG THOÁNG ĐÃNG */}
        {viewMode === 'results' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
            
            {/* Render trực tiếp tab được chọn toàn màn hình, không cố định các khối thừa gây chật chội */}
            {currentTab === 'differentiation' && (
              <PositioningDifferentiation report={activeReport} />
            )}

            {currentTab === 'overview' && (
              <CeoRadarDiagram report={activeReport} />
            )}

            {currentTab === 'canvas' && (
              <CanvasDiagramView report={activeReport} />
            )}

            {currentTab === 'bottlenecks' && (
              <BottleneckDiagramView report={activeReport} />
            )}

            {currentTab === 'action_plan' && (
              <QuickWin90DaysView report={activeReport} />
            )}

            {currentTab === 'report' && (
              <CeoReportView
                report={activeReport}
                onBackToOverview={() => setCurrentTab('differentiation')}
              />
            )}

          </div>
        )}
      </main>

      {/* MODAL: KHÁM DOANH NGHIỆP MỚI */}
      {isNewBusinessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-black text-slate-900">KHÁM DOANH NGHIỆP MỚI</h3>
              </div>
              <button
                onClick={() => setIsNewBusinessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmNewBusiness} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tên của bạn (CEO / Lãnh đạo)
                </label>
                <input
                  type="text"
                  required
                  value={newBizForm.ceoName}
                  onChange={(e) => setNewBizForm({ ...newBizForm, ceoName: e.target.value })}
                  placeholder="Ví dụ: Anh Hoàng"
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tên Doanh Nghiệp
                </label>
                <input
                  type="text"
                  required
                  value={newBizForm.businessName}
                  onChange={(e) => setNewBizForm({ ...newBizForm, businessName: e.target.value })}
                  placeholder="Ví dụ: Công ty Cổ phần Thực phẩm An Phú"
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ngành nghề hoạt động
                </label>
                <input
                  type="text"
                  required
                  value={newBizForm.industry}
                  onChange={(e) => setNewBizForm({ ...newBizForm, industry: e.target.value })}
                  placeholder="Ví dụ: Sản xuất F&B / Bán lẻ"
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewBusinessModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                >
                  Bắt Đầu Phỏng Vấn (10 Phút)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
