import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  BarChart2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DiagnosisReport, RadarScoreItem } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface PositioningDifferentiationProps {
  report: DiagnosisReport;
}

export const PositioningDifferentiation: React.FC<PositioningDifferentiationProps> = ({
  report,
}) => {
  const { positioningSummary, differentiation, radarScores, profile } = report;
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

  // Radar data format
  const radarChartData = radarScores.map((item) => ({
    subject: item.subject,
    score: item.score,
    benchmark: item.benchmark,
    fullText: item.vietnameseFull,
  }));

  const openRadarWhyModal = (item: RadarScoreItem) => {
    setModalData({
      isOpen: true,
      title: `${item.vietnameseFull} (Điểm: ${item.score}/5)`,
      topic: 'Đánh giá năng lực chiến lược & rò rỉ dòng tiền',
      dataObserved: [
        `Phân nhóm: ${item.category}`,
        `Điểm doanh nghiệp: ${item.score}/5`,
        `Điểm chuẩn trung bình ngành: ${item.benchmark}/5`,
      ],
      findings: item.note,
      strategicRationale:
        item.moneyLeakNotice ||
        'Chỉ số này phản ánh khả năng chuyển đổi hoặc giữ chân khách hàng của doanh nghiệp.',
      confidence: 'high',
      actionAdvice:
        item.score < 3
          ? 'Cần đưa vào danh mục hành động cấp thiết trong kế hoạch 90 ngày.'
          : 'Tiếp tục duy trì và biến thành tài sản truyền thông sắc bén.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <Compass className="w-3.5 h-3.5" />
          Vị Thế & Điểm Khác Biệt Cốt Lõi
        </div>
        <h2 className="text-xl font-black text-slate-900">
          DOANH NGHIỆP CỦA BẠN ĐANG ĐỨNG Ở ĐÂU TRÊN THỊ TRƯỜNG?
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Khám phá định vị thực tế và kiểm chứng 5 khu vực khác biệt: bạn đang "tưởng mình khác biệt" hay "thực sự khác biệt trong mắt khách hàng"?
        </p>
      </div>

      {/* 3 Blocks: Vị thế thị trường */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            01. Phân khúc thị trường
          </div>
          <div className="text-sm font-bold text-slate-900 leading-snug">
            {positioningSummary.marketLocation}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            02. Khách hàng mục tiêu cốt lõi
          </div>
          <div className="text-sm font-bold text-slate-900 leading-snug">
            {positioningSummary.targetTier}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            03. Lợi thế khác biệt độc nhất
          </div>
          <div className="text-sm font-bold text-blue-700 leading-snug">
            {positioningSummary.competitiveStand}
          </div>
        </div>
      </div>

      {/* 5 Khu vực Khác biệt (Kiểm chứng bằng chứng) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              KIỂM CHỨNG 5 KHU VỰC KHÁC BIỆT
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ những khác biệt có bằng chứng được khách hàng thừa nhận mới tạo ra dòng tiền bền vững.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {differentiation.map((item, idx) => (
            <div
              key={idx}
              className={`p-4.5 rounded-xl border transition-all ${
                item.hasEvidence
                  ? 'bg-emerald-50/30 border-emerald-200 shadow-2xs'
                  : 'bg-amber-50/30 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.area}
                </span>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold">
                  {item.hasEvidence ? (
                    <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã có bằng chứng
                    </span>
                  ) : (
                    <span className="text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Chưa đủ bằng chứng
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.description}</p>

              <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-400 font-medium">Kiểm chứng: </span>
                <span className="font-medium text-slate-700">{item.evidenceNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RADAR 10 TRỤC SỨC KHỎE (Chi tiết từ User Image 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 mb-1">
              <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
              Ma Trận 10 Trục Năng Lực
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ĐÁNH GIÁ 10 TRỤC & ĐIỂM RÒ RỈ DÒNG TIỀN
            </h3>
            <p className="text-xs text-slate-500">
              Điểm thấp ở bất kỳ trục nào cũng chỉ ra một lỗ hổng làm thất thoát doanh số.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span>Điểm thực tế (1 - 5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
              <span>Chuẩn ngành</span>
            </div>
          </div>
        </div>

        {/* Radar Chart Display */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar
                name="Điểm thực tế"
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Radar
                name="Chuẩn ngành"
                dataKey="benchmark"
                stroke="#94a3b8"
                fill="#cbd5e1"
                fillOpacity={0.2}
              />
              <Tooltip
                formatter={(val, name) => [`${val} / 5 điểm`, name]}
                contentStyle={{ borderRadius: '8px', fontSize: '12px', borderColor: '#e2e8f0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bảng chi tiết 10 trục */}
        <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          {radarScores.map((item, idx) => {
            const isLeak = item.score <= 2;

            return (
              <div
                key={idx}
                className={`py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLeak ? 'bg-rose-50/30' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.vietnameseFull}</span>
                    {isLeak && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                        ⚠️ RÒ RỈ DÒNG TIỀN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-xs font-black text-blue-700">{item.score} / 5 điểm</div>
                    <div className="text-[10px] text-slate-400">Chuẩn: {item.benchmark}</div>
                  </div>

                  <button
                    onClick={() => openRadarWhyModal(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
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
