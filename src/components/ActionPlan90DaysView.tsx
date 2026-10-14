import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  QrCode,
  Flame,
  CheckSquare,
} from 'lucide-react';
import { DiagnosisReport, ActionPlanItem } from '../types';

interface ActionPlan90DaysViewProps {
  report: DiagnosisReport;
  onUpdatePlanStatus?: (planId: string, status: 'done' | 'doing' | 'todo') => void;
}

export const ActionPlan90DaysView: React.FC<ActionPlan90DaysViewProps> = ({
  report,
  onUpdatePlanStatus,
}) => {
  const { ninetyDayPlan, ifOnlyOneThing, profile } = report;
  const [plans, setPlans] = useState<ActionPlanItem[]>(ninetyDayPlan);

  const toggleStatus = (id: string, newStatus: 'done' | 'doing' | 'todo') => {
    const updated = plans.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    setPlans(updated);
    if (onUpdatePlanStatus) {
      onUpdatePlanStatus(id, newStatus);
    }
  };

  const doneCount = plans.filter((p) => p.status === 'done').length;
  const doingCount = plans.filter((p) => p.status === 'doing').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              Lộ Trình Thực Chiến 90 Ngày
            </div>
            <h2 className="text-xl font-black text-slate-900">
              3 ƯU TIÊN HÀNH ĐỘNG QUAN TRỌNG NHẤT
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tập trung giải phóng nguồn lực. Không dàn trải 50 việc nhỏ, chỉ tập trung vào 3 đòn bẩy tháo gỡ điểm nghẽn lớn nhất.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl text-xs font-semibold shrink-0">
            <span className="text-emerald-700 bg-white px-2 py-1 rounded-md shadow-2xs">
              ✅ Đã xong: {doneCount}
            </span>
            <span className="text-amber-800 bg-white px-2 py-1 rounded-md shadow-2xs">
              🟡 Đang làm: {doingCount}
            </span>
            <span className="text-slate-500 px-2 py-1">
              Tổng: {plans.length} giai đoạn
            </span>
          </div>
        </div>
      </div>

      {/* QUICK WIN 90 NGÀY (Lấy cảm hứng từ User Image 4) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            QUICK WIN CHIẾN LƯỢC CHO CEO
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          "Không tìm khách mới trước – Khai thác tối đa giá trị từ khách đã mua"
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Khi chi phí quảng cáo và tiếp cận ngày càng đắt, việc giữ chân khách hàng cũ và kích hoạt họ mua lại đều đặn theo chu kỳ chính là cách nhanh nhất và rẻ nhất để tăng trưởng doanh số tức thì.
        </p>

        {/* 3 Trụ cột Quick Win */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] font-bold text-amber-300 uppercase mb-1">
              Cơ chế 01: Điểm chạm QR Code
            </div>
            <p className="text-slate-200">
              Gắn mã QR trực tiếp lên sản phẩm vật lý để đưa khách offline về hệ thống Zalo OA.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] font-bold text-amber-300 uppercase mb-1">
              Cơ chế 02: Re-Purchase Engine
            </div>
            <p className="text-slate-200">
              Nhắc mua lại tự động vào ngày thứ 40-45 trước khi khách kịp mua thương hiệu khác.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] font-bold text-amber-300 uppercase mb-1">
              Cơ chế 03: Combo Đẩy AOV
            </div>
            <p className="text-slate-200">
              Đóng gói set 3 sản phẩm nâng giá trị trung bình đơn hàng từ 95k lên trên 250k.
            </p>
          </div>
        </div>
      </div>

      {/* 3 GIAI ĐOẠN CHI TIẾT */}
      <div className="space-y-6">
        {plans.map((plan, idx) => {
          return (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {plan.priorityLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Thời hạn: <strong>{plan.timeline}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{plan.title}</h3>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => toggleStatus(plan.id, 'todo')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      plan.status === 'todo'
                        ? 'bg-white text-slate-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Chưa làm
                  </button>
                  <button
                    onClick={() => toggleStatus(plan.id, 'doing')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      plan.status === 'doing'
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🟡 Đang làm
                  </button>
                  <button
                    onClick={() => toggleStatus(plan.id, 'done')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      plan.status === 'done'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ✅ Đã xong
                  </button>
                </div>
              </div>

              {/* Objective */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
                  Mục tiêu trọng tâm của giai đoạn:
                </span>
                <span className="text-slate-800 font-semibold text-sm">{plan.objective}</span>
              </div>

              {/* Action items */}
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-xs mb-2">
                  Các việc cần làm ngay:
                </span>
                <ul className="space-y-2">
                  {plan.actionItems.map((act, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KPI and Expected Result */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    KPI Đo lường thành công:
                  </div>
                  <p className="text-xs font-bold text-blue-950">{plan.kpi}</p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Kết quả kỳ vọng cho doanh nghiệp:
                  </div>
                  <p className="text-xs font-bold text-emerald-950">{plan.expectedResult}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
