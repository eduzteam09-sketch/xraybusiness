import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  TrendingDown,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BottleneckItem, DiagnosisReport } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface BottleneckMapProps {
  report: DiagnosisReport;
}

export const BottleneckMap: React.FC<BottleneckMapProps> = ({ report }) => {
  const { bottlenecks, rootCauseMap } = report;
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(bottlenecks[0]?.id || null);

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

  const zones = [
    { id: 'all', label: 'Tất cả 5 Zone' },
    { id: 'Khách hàng', label: 'Zone 1: Khách hàng' },
    { id: 'Dữ liệu', label: 'Zone 2: Dữ liệu' },
    { id: 'Vận hành', label: 'Zone 3: Vận hành' },
    { id: 'Kênh phân phối', label: 'Zone 4: Kênh phân phối' },
    { id: 'Mở rộng quy mô', label: 'Zone 5: Mở rộng quy mô' },
  ];

  const filteredBottlenecks =
    selectedZone === 'all'
      ? bottlenecks
      : bottlenecks.filter((b) => b.zone === selectedZone);

  const openWhyModal = (b: BottleneckItem) => {
    setModalData({
      isOpen: true,
      title: b.title,
      topic: `Phân tích điểm nghẽn Zone ${b.zone}`,
      dataObserved: [
        `Vị trí trong chuỗi giá trị: ${b.flowStep}`,
        `Mức độ nghiêm trọng: ${b.severity}`,
        ...b.rootCauses,
      ],
      findings: b.why,
      strategicRationale: `Ảnh hưởng đến doanh nghiệp: ${b.impact}`,
      confidence: b.confidence,
      actionAdvice: b.recommendation,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              Bản Đồ Điểm Nghẽn (Bottleneck Map)
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              5 ZONE ĐIỂM NGHẼN ĐANG CẢN TRỞ DÒNG TIỀN
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thay vì xử lý triệu chứng bề mặt, AI bóc tách chính xác vị trí dòng chảy giá trị đang bị nghẽn và nguyên nhân gốc rễ.
            </p>
          </div>

          {/* Zone filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedZone === z.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero: Điểm nghẽn gốc rễ lớn nhất */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider">
            KẾT LUẬN QUAN TRỌNG NHẤT
          </span>
          <span className="text-xs text-rose-800 font-medium">Tìm ra bởi thuật toán phân tích chuỗi</span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-rose-950">
          ĐIỂM NGHẼN GỐC RỄ:{' '}
          <span className="text-rose-700">
            {bottlenecks[0]?.title || 'Tắc kênh & Khả năng mở rộng thị trường'}
          </span>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-rose-900 leading-relaxed max-w-3xl">
          {bottlenecks[0]?.why ||
            'Doanh nghiệp có sản phẩm chất lượng cao nhưng phụ thuộc vào kênh trung gian và chưa biến khách hàng mua thành tài sản số của riêng mình.'}
        </p>

        {/* Value Chain flow indicator */}
        <div className="mt-4 pt-3 border-t border-rose-200/80">
          <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-2">
            Vị trí tắc trên chuỗi giá trị:
          </div>
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {['Thị trường', 'Khách hàng', 'Bán hàng', 'Vận hành', 'Doanh thu', 'Dòng tiền', 'Tăng trưởng'].map(
              (st, idx, arr) => {
                const isBlocked = st === 'Bán hàng' || st === 'Khách hàng' || st === 'Dòng tiền';
                return (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-2.5 py-1 rounded-md font-semibold text-[11px] ${
                        isBlocked
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {st} {isBlocked && '⚠️ TẮC'}
                    </span>
                    {idx < arr.length - 1 && (
                      <span className="text-slate-400 font-bold text-xs">&rarr;</span>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Sơ đồ phân tích chuỗi nguyên nhân gốc rễ (Root Cause Diagram) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Sơ đồ chuỗi nguyên nhân gốc rễ (Root Cause Chain)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Giải thích cơ chế hình thành điểm nghẽn qua 5 lớp logic từ biểu hiện ngoài đến gốc rễ tư duy.
        </p>

        <div className="space-y-3">
          {rootCauseMap.chain.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-3 ${
                idx === rootCauseMap.chain.length - 1
                  ? 'bg-rose-50 border-rose-200 font-medium'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 sm:w-44 shrink-0">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    idx === rootCauseMap.chain.length - 1
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {idx + 1}
                </span>
                <span
                  className={`text-xs font-bold ${
                    idx === rootCauseMap.chain.length - 1 ? 'text-rose-900' : 'text-slate-700'
                  }`}
                >
                  {step.step}
                </span>
              </div>

              <div className="flex-1 text-xs text-slate-800 leading-relaxed">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách các điểm nghẽn chi tiết */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          CHI TIẾT CÁC ĐIỂM NGHẼN CẦN THÁO GỠ ({filteredBottlenecks.length})
        </h3>

        {filteredBottlenecks.map((b) => {
          const isExpanded = expandedId === b.id;

          const severityClass = {
            'Rất cao': 'bg-rose-100 text-rose-800 border-rose-200',
            Cao: 'bg-amber-100 text-amber-800 border-amber-200',
            'Trung bình': 'bg-blue-100 text-blue-800 border-blue-200',
            Thấp: 'bg-slate-100 text-slate-800 border-slate-200',
          }[b.severity];

          return (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Header bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      Zone: {b.zone}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${severityClass}`}
                    >
                      Mức độ: {b.severity}
                    </span>
                    <span className="text-xs text-slate-400">
                      Chuỗi: <strong>{b.flowStep}</strong>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{b.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openWhyModal(b);
                    }}
                    title="Xem AI phân tích căn cứ"
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsible body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {/* 1. Vì sao */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        1. Vì sao xảy ra?
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{b.why}</p>
                    </div>

                    {/* 2. Ảnh hưởng */}
                    <div className="p-3 bg-white rounded-lg border border-rose-100 bg-rose-50/20">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                        2. Ảnh hưởng đến dòng tiền
                      </div>
                      <p className="text-xs text-rose-950 font-medium leading-relaxed">{b.impact}</p>
                    </div>

                    {/* 3. Nên làm gì */}
                    <div className="p-3 bg-white rounded-lg border border-emerald-100 bg-emerald-50/20">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                        3. Khuyến nghị giải quyết
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {b.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Root cause chain list */}
                  {b.rootCauses && b.rootCauses.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                        Chuỗi suy luận của AI:
                      </div>
                      <ul className="space-y-1">
                        {b.rootCauses.map((rc, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{rc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => openWhyModal(b)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      <span>Xem đầy đủ giải thích & bằng chứng</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
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
