import React from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { ConfidenceLevel } from '../types';

interface AiWhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  topic: string;
  dataObserved: string[];
  findings: string;
  strategicRationale: string;
  confidence: ConfidenceLevel;
  actionAdvice?: string;
}

export const AiWhyModal: React.FC<AiWhyModalProps> = ({
  isOpen,
  onClose,
  title,
  topic,
  dataObserved,
  findings,
  strategicRationale,
  confidence,
  actionAdvice,
}) => {
  if (!isOpen) return null;

  const confidenceBadge = {
    high: {
      text: 'Có cơ sở rõ ràng',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    medium: {
      text: 'Cần thêm thông tin kiểm chứng',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
    },
    low: {
      text: 'Chưa đủ dữ liệu sâu',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: <Info className="w-4 h-4 text-slate-500" />,
    },
  }[confidence];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        id="ai-why-modal"
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">AI PHÂN TÍCH: VÌ SAO?</h3>
              <p className="text-xs text-slate-500">{topic}</p>
            </div>
          </div>
          <button
            id="close-why-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Target assertion */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3.5">
            <div className="text-xs font-semibold text-blue-900 mb-1">KẾT LUẬN CỦA CHUYÊN GIA AI</div>
            <div className="text-sm font-medium text-blue-950">{title}</div>
          </div>

          {/* Dữ liệu đã xem */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Dữ liệu đã xem xét
            </div>
            <ul className="space-y-1.5">
              {dataObserved.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quan sát cốt lõi */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Quan sát thực tế
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
              {findings}
            </p>
          </div>

          {/* Nhận định logic */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Lập luận chiến lược
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-indigo-50/50 p-3 rounded-md border border-indigo-100/60">
              {strategicRationale}
            </p>
          </div>

          {actionAdvice && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Khuyến nghị CEO nên làm
              </div>
              <p className="text-xs font-medium text-emerald-900 bg-emerald-50 p-3 rounded-md border border-emerald-200">
                {actionAdvice}
              </p>
            </div>
          )}

          {/* Mức độ chắc chắn */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">Mức độ chắc chắn của phân tích:</div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${confidenceBadge.badgeClass}`}>
              {confidenceBadge.icon}
              <span>{confidenceBadge.text}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="modal-understood-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Đã hiểu, đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
