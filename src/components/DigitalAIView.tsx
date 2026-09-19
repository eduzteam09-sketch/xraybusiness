import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  TrendingUp,
  Clock,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { DiagnosisReport, AiInitiative } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface DigitalAIViewProps {
  report: DiagnosisReport;
}

export const DigitalAIView: React.FC<DigitalAIViewProps> = ({ report }) => {
  const { digitalAndAi, profile } = report;
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

  const openWhyModal = (item: AiInitiative) => {
    setModalData({
      isOpen: true,
      title: item.title,
      topic: 'Sáng kiến số hóa & Ứng dụng AI thực chiến',
      dataObserved: [
        `Mức độ sẵn sàng số hóa: ${digitalAndAi.readinessScore}/100`,
        `Độ khó: ${item.difficulty}`,
        `Công cụ đề xuất: ${item.suggestedTools.join(', ')}`,
      ],
      findings: item.whyPriority,
      strategicRationale: item.impact,
      confidence: 'high',
      actionAdvice: `Bắt đầu triển khai thử nghiệm với các công cụ: ${item.suggestedTools.join(', ')}.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 mb-2">
          <Cpu className="w-3.5 h-3.5" />
          Chiến Lược Số Hóa & Ứng Dụng AI
        </div>
        <h2 className="text-xl font-black text-slate-900">
          AI VÀ SỐ HÓA CÓ THỂ LÀM ĐƯỢC GÌ CHO BẠN NGAY HÔM NAY?
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Không nói lý thuyết chung chung. Chỉ tập trung vào những ứng dụng trực tiếp giúp giảm chi phí, tăng tốc độ và bảo vệ dòng tiền.
        </p>
      </div>

      {/* Readiness Dial Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Chỉ số sẵn sàng số hóa & AI
          </span>
          <h3 className="text-xl font-black text-slate-900">
            {digitalAndAi.readinessScore}/100 –{' '}
            <span className="text-blue-700">{digitalAndAi.levelTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Doanh nghiệp đã có các điểm chạm cơ bản nhưng đang thiếu các điểm chạm số tự động để gom dữ liệu và giữ chân khách hàng.
          </p>
        </div>

        <div className="w-full md:w-64 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shrink-0">
          <div
            className="bg-cyan-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${digitalAndAi.readinessScore}%` }}
          ></div>
        </div>
      </div>

      {/* Bảng Kiểm Kê Công Cụ (Tools Inventory) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          BẢNG KIỂM KÊ CÔNG CỤ SỐ HIỆN TẠI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Đã có */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              Công cụ doanh nghiệp đang sử dụng:
            </div>
            <ul className="space-y-1.5">
              {digitalAndAi.currentTools.map((t, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Còn thiếu */}
          <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200">
            <div className="text-xs font-bold text-rose-800 mb-2.5 flex items-center gap-1.5">
              <Square className="w-4 h-4 text-rose-600" />
              Điểm chạm số hóa quan trọng đang còn thiếu:
            </div>
            <ul className="space-y-1.5">
              {digitalAndAi.missingCrucialTools.map((t, idx) => (
                <li key={idx} className="text-xs text-rose-950 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3 VIỆC AI CÓ THỂ GIÚP NGAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              3 VIỆC AI CÓ THỂ HỖ TRỢ NGAY CHO DOANH NGHIỆP
            </h3>
            <p className="text-xs text-slate-500">
              Được thiết kế riêng theo đặc thù ngành {profile.industry}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {digitalAndAi.initiatives.map((item, idx) => {
            const diffClass = {
              Dễ: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              'Trung bình': 'bg-amber-100 text-amber-800 border-amber-200',
              'Nâng cao': 'bg-rose-100 text-rose-800 border-rose-200',
            }[item.difficulty];

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-cyan-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-900 flex items-center justify-center text-xs font-black">
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${diffClass}`}
                    >
                      Độ khó: {item.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Vì sao nên ưu tiên việc này?
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {item.whyPriority}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Tác động trực tiếp:
                    </span>
                    <p className="text-xs text-emerald-950 font-semibold bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60">
                      {item.impact}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-slate-400" />
                    Công cụ gợi ý sử dụng:
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.suggestedTools.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openWhyModal(item)}
                    className="w-full py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Xem lộ trình triển khai</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
