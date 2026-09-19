import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { DiagnosisReport, StrategicOpportunity } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface OpportunitiesViewProps {
  report: DiagnosisReport;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ report }) => {
  const { opportunities, profile } = report;
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

  const openWhyModal = (opp: StrategicOpportunity) => {
    setModalData({
      isOpen: true,
      title: opp.title,
      topic: `Cơ hội chiến lược: ${opp.category}`,
      dataObserved: [
        `Doanh nghiệp: ${profile.businessName}`,
        `Phân loại cơ hội: ${opp.category}`,
        `Mức độ ưu tiên: ${opp.priority}`,
      ],
      findings: opp.whyAiFoundIt,
      strategicRationale:
        'Cơ hội này nằm ở giao điểm giữa năng lực lõi của doanh nghiệp và khoảng trống đối thủ cạnh tranh chưa khai thác triệt để.',
      confidence: 'high',
      actionAdvice: opp.whatCanBeDone,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
          <Lightbulb className="w-3.5 h-3.5" />
          Khoảng Trống & Cơ Hội Mới
        </div>
        <h2 className="text-xl font-black text-slate-900">
          CƠ HỘI NÀO ĐANG CHỜ BẠN KHAI PHÁ?
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          AI rà soát toàn bộ chuỗi giá trị và phát hiện các thị trường ngách, nhu cầu khách hàng bị bỏ quên và kênh khai thác lợi nhuận cao.
        </p>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {opportunities.map((opp) => {
          const isHighPriority = opp.priority === 'Cao';

          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                    {opp.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isHighPriority
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    Ưu tiên: {opp.priority}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{opp.title}</h3>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Vì sao AI phát hiện cơ hội này?
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {opp.whyAiFoundIt}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Hành động có thể làm ngay:
                  </span>
                  <p className="text-xs text-emerald-950 font-semibold bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60">
                    {opp.whatCanBeDone}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <button
                  onClick={() => openWhyModal(opp)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
                >
                  <span>Căn cứ phân tích</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ai Why Modal */}
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
