import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Layers,
} from 'lucide-react';
import { DiagnosisReport } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface PositioningDifferentiationProps {
  report: DiagnosisReport;
}

export const PositioningDifferentiation: React.FC<PositioningDifferentiationProps> = ({
  report,
}) => {
  const { positioningSummary, differentiation, profile } = report;
  const bName = profile.businessName || 'Doanh Nghiệp';

  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    topic: string;
    dataObserved: string[];
    findings: string;
    strategicRationale: string;
    confidence: 'high' | 'medium' | 'low';
    actionAdvice?: string;
  }>({
    isOpen: false,
    title: '',
    topic: '',
    dataObserved: [],
    findings: '',
    strategicRationale: '',
    confidence: 'high',
  });

  const openDifferentiationModal = (item: any) => {
    setModalData({
      isOpen: true,
      title: `Kiểm chứng khác biệt: ${item.area}`,
      topic: 'Đánh giá tính độc nhất & bằng chứng khách hàng tin tưởng',
      dataObserved: [
        `Khía cạnh: ${item.area}`,
        `Hiện trạng: ${item.title || item.description}`,
        `Bằng chứng thực tế: ${item.hasEvidence ? 'Đã kiểm chứng thực tế' : 'Chưa có bằng chứng đo lường'}`,
      ],
      findings: item.description || item.evidenceNote,
      strategicRationale: item.hasEvidence
        ? 'Đây là lợi thế cạnh tranh thật sự cần khai thác triệt để trong các thông điệp bán hàng.'
        : 'Nếu chỉ khác biệt trong suy nghĩ của CEO mà khách hàng không nhận ra thì chưa tạo thành tiền.',
      confidence: item.hasEvidence ? 'high' : 'medium',
      actionAdvice: item.hasEvidence
        ? 'Đóng gói thành cam kết chất lượng độc quyền.'
        : 'Cần bổ sung chứng nhận, thử nghiệm hoặc phản hồi khách hàng để chứng minh.',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 font-sans">
      
      {/* 1. HEADER CHUẨN REFERO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>01. GIÁ TRỊ &amp; ĐỊNH VỊ CỐT LÕI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vị Thế Cạnh Tranh &amp; Điểm Khác Biệt
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Doanh nghiệp: <strong className="text-slate-900">{bName}</strong> • CEO: <strong className="text-slate-800">{profile.ceoName || 'Lãnh đạo'}</strong>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Kiểm Chứng 5 Khía Cạnh Cạnh Tranh</span>
        </div>
      </div>

      {/* 2. TOP 3 STRATEGIC PILLARS (BENTO CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Khối 1: Phân Khúc Thị Trường */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                01. VỊ TRÍ PHÂN KHÚC
              </span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-base font-black text-white mt-1">
              {positioningSummary?.marketLocation || 'Phân khúc trung & cao cấp'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Tập trung vào phân khúc coi trọng uy tín, chất lượng thật và giá trị sức khỏe bền vững.
          </p>
        </div>

        {/* Khối 2: Khách Hàng Mục Tiêu Trả Tiền */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-2.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                02. TỆP KHÁCH TẠO TIỀN
              </span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {positioningSummary?.targetTier || 'Khách hàng quan tâm chất lượng'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Tệp khách hàng sẵn sàng chi trả mức giá xứng đáng để đổi lấy sự yên tâm và cam kết minh bạch.
          </p>
        </div>

        {/* Khối 3: Lợi Thế Cạnh Tranh Độc Nhất */}
        <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200 space-y-2.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                03. ĐÒN BẨY ĐỊNH VỊ
              </span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-black text-blue-950 mt-1">
              {positioningSummary?.competitiveStand || 'Chất lượng cốt lõi & Uy tín gia truyền'}
            </h3>
          </div>
          <p className="text-xs text-blue-900 leading-relaxed font-medium">
            Lợi thế khác biệt không thể sao chép nhanh, là nền tảng để triển khai chuỗi Re-purchase 90 ngày.
          </p>
        </div>

      </div>

      {/* 3. MA TRẬN 5 KHÍA CẠNH KHÁC BIỆT CỦA DOANH NGHIỆP */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Bảng Đánh Giá 5 Khía Cạnh Khác Biệt
            </h3>
            <p className="text-xs text-slate-500">
              Kiểm chứng: Khác biệt thực tế đã được công nhận vs Khác biệt tiềm năng cần bổ sung bằng chứng.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Đã có bằng chứng
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cần đo lường thêm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {differentiation.map((item, idx) => {
            const hasEv = item.hasEvidence;

            return (
              <div
                key={idx}
                onClick={() => openDifferentiationModal(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:shadow-md hover:scale-[1.01] ${
                  hasEv
                    ? 'bg-white border-emerald-200 hover:border-emerald-400'
                    : 'bg-white border-amber-200 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      0{idx + 1}. {item.area}
                    </span>
                    {hasEv ? (
                      <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-3 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span
                    className={`font-black ${
                      hasEv ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {hasEv ? '✓ Khác biệt thật' : '⚠ Cần bằng chứng'}
                  </span>
                  <span className="text-slate-400 group-hover:text-blue-600 font-bold">
                    Chi tiết →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      <AiWhyModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        topic={modalData.topic}
        dataObserved={modalData.dataObserved}
        findings={modalData.findings}
        strategicRationale={modalData.strategicRationale}
        confidence={modalData.confidence}
        actionAdvice={modalData.actionAdvice}
      />

    </div>
  );
};
