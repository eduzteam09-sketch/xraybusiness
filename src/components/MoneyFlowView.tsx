import React, { useState } from 'react';
import {
  Coins,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { DiagnosisReport, MoneyFlowItem } from '../types';
import { AiWhyModal } from './AiWhyModal';

interface MoneyFlowViewProps {
  report: DiagnosisReport;
}

export const MoneyFlowView: React.FC<MoneyFlowViewProps> = ({ report }) => {
  const { moneyFlow } = report;
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

  const openMoneyFlowWhyModal = (item: MoneyFlowItem) => {
    setModalData({
      isOpen: true,
      title: item.name,
      topic: 'Phân tích dòng tiền & khả năng mở rộng doanh thu',
      dataObserved: [
        `Sản phẩm: ${item.sourceProduct}`,
        `Khách hàng mục tiêu: ${item.targetCustomer}`,
        `Kênh phân phối: ${item.channel}`,
        `Tần suất: ${item.frequency}`,
        `Tỷ trọng đóng góp: ${item.shareOrEstimate}`,
      ],
      findings: item.description || 'Dòng tiền có vai trò chiến lược đối với sức khỏe tài chính doanh nghiệp.',
      strategicRationale:
        item.type === 'current'
          ? 'Đang có rủi ro phụ thuộc kênh hoặc công nợ dài, cần cơ chế phân bổ doanh thu đa dạng.'
          : 'Dòng tiền tiềm năng khai thác trực tiếp từ năng lực sản phẩm cốt lõi mà không tốn nhiều chi phí đầu tư mới.',
      confidence: 'high',
      actionAdvice:
        item.type === 'current'
          ? 'Bảo vệ nguồn tiền hiện tại đồng thời rút ngắn chu kỳ thu tiền mặt.'
          : 'Triển khai thử nghiệm trong 30-60 ngày tới.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          <Coins className="w-3.5 h-3.5" />
          Quản Trị Dòng Tiền Chiến Lược
        </div>
        <h2 className="text-xl font-black text-slate-900">
          TIỀN ĐANG ĐI VÀO DOANH NGHIỆP TỪ ĐÂU?
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Nhìn thấu bức tranh dòng tiền thực tế, rủi ro phụ thuộc đơn kênh và bản đồ chuyển dịch sang đa dòng tiền bền vững.
        </p>
      </div>

      {/* Summary Highlight */}
      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Đánh giá dòng tiền từ chuyên gia AI:
        </div>
        <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
          {moneyFlow.summary}
        </p>
      </div>

      {/* Logic Chuyển Dịch Dòng Tiền (Transformation Logic) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
          LOGIC DỊCH CHUYỂN DÒNG TIỀN (5 BƯỚC)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Cách thức chuyển hóa tài sản và năng lực sẵn có thành nguồn tiền mới mà không cần đầu tư dàn trải.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed">
          {moneyFlow.transformationLogic}
        </div>
      </div>

      {/* Grid: Dòng tiền Hiện Tại vs Dòng tiền Tiềm Năng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột 1: Dòng tiền Hiện Tại */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              DÒNG TIỀN HIỆN TẠI ({moneyFlow.currentFlows.length})
            </h3>
            <span className="text-xs text-slate-500">Nguồn nuôi sống hiện nay</span>
          </div>

          {moneyFlow.currentFlows.map((flow) => (
            <div
              key={flow.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{flow.name}</h4>
                  <div className="text-xs font-bold text-blue-700 mt-0.5">
                    Đóng góp: {flow.shareOrEstimate}
                  </div>
                </div>

                <button
                  onClick={() => openMoneyFlowWhyModal(flow)}
                  className="text-slate-400 hover:text-blue-600 p-1"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sản phẩm</span>
                  <span className="text-slate-700 font-medium">{flow.sourceProduct}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Khách hàng</span>
                  <span className="text-slate-700 font-medium">{flow.targetCustomer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kênh bán</span>
                  <span className="text-slate-700 font-medium">{flow.channel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tần suất</span>
                  <span className="text-slate-700 font-medium">{flow.frequency}</span>
                </div>
              </div>

              {flow.description && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                  {flow.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cột 2: Dòng tiền Tiềm Năng Mới */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              DÒNG TIỀN TIỀM NĂNG MỚI ({moneyFlow.potentialFlows.length})
            </h3>
            <span className="text-xs text-emerald-700 font-medium">Cơ hội bứt phá biên lợi nhuận</span>
          </div>

          {moneyFlow.potentialFlows.map((flow) => (
            <div
              key={flow.id}
              className="bg-white rounded-xl border border-emerald-200 p-5 shadow-2xs space-y-3 bg-emerald-50/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mb-1">
                    <Sparkles className="w-3 h-3" />
                    Đòn bẩy mới
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{flow.name}</h4>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">
                    Kỳ vọng: {flow.shareOrEstimate}
                  </div>
                </div>

                <button
                  onClick={() => openMoneyFlowWhyModal(flow)}
                  className="text-slate-400 hover:text-emerald-600 p-1"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sản phẩm mới</span>
                  <span className="text-slate-800 font-medium">{flow.sourceProduct}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Khách hàng đích</span>
                  <span className="text-slate-800 font-medium">{flow.targetCustomer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kênh phân phối</span>
                  <span className="text-slate-800 font-medium">{flow.channel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chu kỳ tiền</span>
                  <span className="text-slate-800 font-medium">{flow.frequency}</span>
                </div>
              </div>

              {flow.description && (
                <div className="p-2.5 bg-white rounded-lg text-xs text-emerald-950 border border-emerald-100 font-medium">
                  {flow.description}
                </div>
              )}
            </div>
          ))}
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
