import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
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
import { Building2, X, Download, Mail, Sparkles, AlertTriangle } from 'lucide-react';

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
    industry: 'Sản xuất & Thương mại',
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

    const found = SAMPLE_PROFILES_LIST.find((s) => s.profile.id === profileId);
    if (found) {
      updateActiveReport(found);
    }
  };

  const handleStartNewCheckupFromLanding = (formData?: {
    ceoName: string;
    email: string;
    businessName: string;
    industry: string;
  }) => {
    if (formData && formData.businessName.trim()) {
      const newProfile: BusinessProfile = {
        id: `biz-${Date.now()}`,
        ceoName: formData.ceoName.trim() || 'CEO',
        email: formData.email.trim(),
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
    if (profileId) {
      const found = SAMPLE_PROFILES_LIST.find((s) => s.profile.id === profileId);
      if (found) {
        updateActiveReport(found);
      }
    }
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* 
        Menu bên trái chỉ hiển thị khi ở màn hình kết quả (viewMode === 'results').
        Tone màu sáng, thanh lịch, chuẩn Neo-grotesque.
      */}
      {viewMode === 'results' && (
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          hasDiagnosis={Boolean(activeReport)}
          onBackToHome={() => setViewMode('home')}
          onStartNewCheckup={() => setIsNewBusinessModalOpen(true)}
        />
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Header hiển thị ở màn hình Kết Quả và Trang Chủ */}
        {viewMode !== 'checkup' && (
          <Header
            profile={activeReport.profile}
            healthScore={activeReport?.healthScore}
            viewMode={viewMode}
            onSelectSample={handleSelectSample}
            onStartNewCheckup={() => setIsNewBusinessModalOpen(true)}
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

        {/* Content Router */}
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

          {/* 3. MÀN HÌNH DASHBOARD ĐỒ HỌA KẾT QUẢ CHIẾN LƯỢC */}
          {viewMode === 'results' && (
            <div className="space-y-6 pb-20">
              
              {/* Mobile Segmented Switcher (Thanh cuộn ngang trên di động) */}
              <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none sticky top-14 z-20 shadow-2xs">
                {[
                  { id: 'differentiation' as NavTab, label: '01. Giá Trị & Khác Biệt' },
                  { id: 'overview' as NavTab, label: '02. Radar Sức Khỏe' },
                  { id: 'canvas' as NavTab, label: '03. Canvas 9 Ô' },
                  { id: 'bottlenecks' as NavTab, label: '04. Bản Đồ 5 Zone', isHot: true },
                  { id: 'action_plan' as NavTab, label: '05. Lộ Trình 90N' },
                  { id: 'report' as NavTab, label: '06. Báo Cáo CEO & PDF', isSpecial: true },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      currentTab === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : item.isSpecial
                        ? 'bg-slate-900 text-white border border-slate-800'
                        : item.isHot
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* TOP EXECUTIVE QUICK BAR CHO KẾT QUẢ */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                        BẢN ĐỒ CHIẾN LƯỢC ĐIỀU HÀNH 2026
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {activeReport.profile.businessName} • CEO {activeReport.profile.ceoName || 'Lãnh Đạo'}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      💡 Màn hình hiển thị các đồ họa trực quan cấp cao. Bấm nút bên phải để tải hồ sơ chi tiết A4 hoặc gửi về Email.
                    </p>
                  </div>

                  {/* 2 Nút Hành Động Lớn */}
                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    <button
                      onClick={() => setCurrentTab('report')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-[1.01]"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Tải Báo Cáo PDF Chi Tiết (A4)</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('report')}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-[1.01]"
                    >
                      <Mail className="w-4 h-4 text-blue-300" />
                      <span>Gửi Báo Cáo Vào Email CEO</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RENDER CÁC SƠ ĐỒ ĐỒ HỌA TRỰC QUAN NHƯ 5 HÌNH ẢNH */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* TAB 1: GIÁ TRỊ CỐT LÕI & ĐIỂM KHÁC BIỆT */}
                {currentTab === 'differentiation' && (
                  <PositioningDifferentiation report={activeReport} />
                )}

                {/* TAB 2: SƠ ĐỒ CHẨN ĐOÁN SỨC KHỎE TỔNG THỂ (RADAR 10 TRỤC) */}
                {currentTab === 'overview' && (
                  <CeoRadarDiagram report={activeReport} />
                )}

                {/* TAB 3: MÔ HÌNH KINH DOANH CANVAS 9 Ô */}
                {currentTab === 'canvas' && (
                  <CanvasDiagramView report={activeReport} />
                )}

                {/* TAB 4: BẢN ĐỒ ĐIỂM NGHẼN 5 ZONE VẬN HÀNH DÒNG TIỀN */}
                {currentTab === 'bottlenecks' && (
                  <BottleneckDiagramView report={activeReport} />
                )}

                {/* TAB 5: QUICK WIN 90 NGÀY & RE-PURCHASE ENGINE */}
                {currentTab === 'action_plan' && (
                  <QuickWin90DaysView report={activeReport} />
                )}

                {/* TAB 6: BÁO CÁO CHI TIẾT & XUẤT BẢN PDF / GỬI EMAIL */}
                {currentTab === 'report' && (
                  <CeoReportView
                    report={activeReport}
                    onBackToOverview={() => setCurrentTab('differentiation')}
                  />
                )}

              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: KHÁM DOANH NGHIỆP MỚI */}
      {isNewBusinessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">KHÁM DOANH NGHIỆP MỚI</h3>
              </div>
              <button
                onClick={() => setIsNewBusinessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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
                  placeholder="Ví dụ: Bán lẻ F&B / Công nghệ số"
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewBusinessModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Bắt Đầu Phỏng Vấn Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
