import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Target,
  BarChart3,
  Layers,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  RotateCcw,
  Clock,
  LayoutDashboard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BusinessProfile, InterviewMessage, DiagnosisReport } from '../types';
import { askAiInterviewStep, generateFullDiagnosis, AiInterviewReply } from '../services/aiService';

interface CheckupInterviewProps {
  initialProfile: BusinessProfile;
  onDiagnosisComplete: (report: DiagnosisReport) => void;
  onCancel: () => void;
}

const STRATEGIC_PILLARS = [
  { id: 1, title: '01. Mô hình & Sản phẩm', short: 'Mô hình', desc: 'Sản phẩm cốt lõi & Giá trị', icon: Building2 },
  { id: 2, title: '02. Khách hàng mục tiêu', short: 'Khách hàng', desc: 'Chân dung nhóm trả tiền', icon: Users },
  { id: 3, title: '03. Kênh bán & Tiếp cận', short: 'Kênh bán', desc: 'Chi phí & Đa điểm chạm', icon: Target },
  { id: 4, title: '04. Dòng tiền & Rò rỉ', short: 'Dòng tiền', desc: 'Tái mua, công nợ & Lỗ rò', icon: BarChart3 },
  { id: 5, title: '05. Vận hành & Phụ thuộc', short: 'Vận hành', desc: 'Quy trình & Đòn bẩy CEO', icon: Award },
  { id: 6, title: '06. Đột phá 90 ngày', short: 'Đột phá 90N', desc: 'Ưu tiên số hóa & Tăng trưởng', icon: Layers },
];

const COMMON_PAIN_POINTS = [
  { label: '📉 Khách mua 1 lần rồi thôi', text: 'Khách hàng mua một lần rồi ít khi quay lại, chi phí tìm khách mới ngày càng cao.' },
  { label: '💰 Chi phí ads tăng phi mã', text: 'Chi phí quảng cáo Facebook/TikTok tăng nhanh làm bào mòn biên lợi nhuận.' },
  { label: '⏳ CEO ôm đồm mọi việc', text: 'Việc gì cũng tới tay CEO, nhân viên thiếu chủ động, thiếu quy trình chuẩn SOP.' },
  { label: '📦 Đọng vốn hàng tồn/công nợ', text: 'Dòng tiền mặt bị kẹt ở công nợ đại lý và hàng tồn kho quay vòng chậm.' },
  { label: '👥 Nhân sự thiếu chủ động', text: 'Đội ngũ làm việc bị động, chưa có người gánh vác các vị trí chủ chốt.' },
  { label: '📊 Quản lý thủ công/chưa có CRM', text: 'Dữ liệu khách hàng còn phân tán ở sổ sách và Excel, chưa có hệ thống tự động chăm sóc.' },
];

export const CheckupInterview: React.FC<CheckupInterviewProps> = ({
  initialProfile,
  onDiagnosisComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile] = useState<BusinessProfile>(initialProfile);
  const [mode, setMode] = useState<'standard' | 'deep'>('standard');
  const [isDrillDown, setIsDrillDown] = useState<boolean>(false);
  const [dataConfidence, setDataConfidence] = useState<number>(30);
  const [detectedBottlenecks, setDetectedBottlenecks] = useState<string[]>([]);
  const [conversationCount, setConversationCount] = useState<number>(1);

  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Xin chào CEO ${initialProfile.ceoName || 'Lãnh Đạo'}. Hãy xem đây như một phiên tư vấn chiến lược cấp cao trực tiếp giữa hai cộng sự điều hành.\n\nAnh/chị có thể bấm chọn gợi ý nhanh bên dưới hoặc gõ ngắn gọn theo cách nói hàng ngày. AI sẽ tự động phân tích và chuyển hóa vào Bản Đồ Chiến Lược Canvas 9 Danh Mục.\n\nKhởi động: Sản phẩm hoặc dịch vụ cốt lõi mang lại dòng doanh thu chính cho ${initialProfile.businessName || 'doanh nghiệp'} hiện nay là gì?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickAnswers: [
        'Sản xuất & Chế biến thực phẩm (F&B / Bán buôn)',
        'Kinh doanh bán lẻ / Chuỗi cửa hàng phân phối',
        'Dịch vụ tư vấn / B2B / Giải pháp doanh nghiệp',
        'Bán hàng Online / Thương mại điện tử đa kênh',
      ],
      stepIndex: 1,
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  // Extracted live insights
  const [extractedData, setExtractedData] = useState<{
    coreProduct?: string;
    targetCustomer?: string;
    coreAdvantage?: string;
    mainChannel?: string;
    repeatPurchaseMechanism?: string;
    cashflowLeak?: string;
    ceoBottleneck?: string;
    goal90Days?: string;
  }>({
    coreProduct: initialProfile.businessName ? `${initialProfile.businessName} (${initialProfile.industry})` : undefined,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'vi-VN';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setInputVal((prev) => (prev ? prev + ' ' : '') + event.results[i][0].transcript);
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ ghi âm tiếng Việt. Bạn có thể bấm chọn gợi ý nhanh hoặc gõ bàn phím.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Mic error:', err);
      }
    }
  };

  const handleInsertPainPoint = (painText: string) => {
    setInputVal((prev) => {
      if (!prev.trim()) return painText;
      return `${prev.trim()} - ${painText}`;
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSendAnswer = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setInputVal('');

    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stepIndex: currentStep,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    const newCount = conversationCount + 1;
    setConversationCount(newCount);

    updateExtractedInsights(currentStep, text);
    setIsLoading(true);

    try {
      const aiReply: AiInterviewReply = await askAiInterviewStep(
        profile,
        currentStep,
        text,
        newHistory,
        mode,
        isDrillDown,
        newCount
      );

      if (aiReply.dataConfidencePercent) {
        setDataConfidence((prev) => Math.max(prev, aiReply.dataConfidencePercent || 0));
      } else {
        setDataConfidence((prev) => Math.min(95, prev + 15));
      }

      if (aiReply.detectedBottleneck) {
        setDetectedBottlenecks((prev) =>
          prev.includes(aiReply.detectedBottleneck!)
            ? prev
            : [...prev, aiReply.detectedBottleneck!]
        );
      }

      const nextIsDrillDown = Boolean(aiReply.isDrillDown);
      setIsDrillDown(nextIsDrillDown);

      let nextStep = currentStep;
      if (!nextIsDrillDown && currentStep < 6) {
        nextStep = currentStep + 1;
      }
      setCurrentStep(nextStep);

      const aiMsg: InterviewMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `${aiReply.acknowledgement}\n\n${aiReply.nextQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickAnswers: aiReply.quickAnswers,
        stepIndex: nextStep,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (aiReply.readyToFinalize && currentStep >= 6 && !nextIsDrillDown) {
        setTimeout(() => {
          handleCompleteCheckup([...newHistory, aiMsg]);
        }, 1000);
      }
    } catch (err) {
      console.error('Lỗi phân tích AI:', err);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const updateExtractedInsights = (step: number, answer: string) => {
    setExtractedData((prev) => {
      switch (step) {
        case 1:
          return { ...prev, coreProduct: answer };
        case 2:
          return { ...prev, targetCustomer: answer };
        case 3:
          return { ...prev, coreAdvantage: answer };
        case 4:
          return { ...prev, mainChannel: answer, cashflowLeak: answer };
        case 5:
          return { ...prev, repeatPurchaseMechanism: answer, ceoBottleneck: answer };
        case 6:
          return { ...prev, goal90Days: answer };
        default:
          return prev;
      }
    });
  };

  const handleCompleteCheckup = async (history?: InterviewMessage[]) => {
    setIsFinalizing(true);
    try {
      const historyToUse = history || messages;
      const diagnosisResult = await generateFullDiagnosis(profile, historyToUse);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      onDiagnosisComplete(diagnosisResult);
    } catch (e) {
      console.error('Finalize diagnosis failed:', e);
      setIsFinalizing(false);
    }
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  // Loading/finalizing screen
  if (isFinalizing) {
    return (
      <div className="max-w-3xl mx-auto py-16 sm:py-24 px-4 text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping opacity-40"></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl animate-pulse">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Đang Bóc Tách &amp; Vẽ Bản Đồ Điều Hành
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đang Tổng Hợp Bản Đồ Chiến Lược CEO...
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            Hệ thống đang chuẩn hóa 9 ô Canvas, đo lường 10 trục sức khỏe, bóc tách 3 điểm nghẽn và đóng gói Lộ trình 90 ngày cho CEO {profile.ceoName || 'Lãnh Đạo'}.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-5 text-left text-xs space-y-3 shadow-md">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Chuẩn hóa 9 ô Mô hình kinh doanh Canvas</span>
          </div>
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Bóc tách điểm nghẽn rò rỉ dòng tiền &amp; khách hàng</span>
          </div>
          <div className="flex items-center gap-2.5 text-indigo-600 font-bold animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Đang tạo Radar 10 trục sức khỏe &amp; Quick Win 90 ngày...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 pb-20 font-sans">
      
      {/* 1. TOP BAR: TIẾN TRÌNH & TRỤ CỘT ĐIỀU HÀNH HIỆN ĐẠI */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Phòng Khám Chiến Lược AI
              </span>
              <span className="text-xs font-bold text-slate-700">
                {profile.businessName} • CEO {profile.ceoName || 'Lãnh Đạo'}
              </span>
              {isDrillDown && (
                <span className="text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-rose-600" />
                  Đang bóc tách điểm nghẽn
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Bước {currentStep}/6: {STRATEGIC_PILLARS[currentStep - 1]?.title}
            </h1>
          </div>

          {/* Actions & Confidence */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('standard')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tiêu Chuẩn
              </button>
              <button
                type="button"
                onClick={() => setMode('deep')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  mode === 'deep'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Zap className="w-3 h-3" />
                Chuyên Sâu
              </button>
            </div>

            {/* Quick Finish Button */}
            <button
              onClick={() => handleCompleteCheckup()}
              className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
              title="Nhấn để ra bảng kết quả ngay lập tức"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem Dashboard Ngay</span>
            </button>

            <button
              onClick={onCancel}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Thoát
            </button>
          </div>
        </div>

        {/* 6 Step Progress Stepper Cards (Bắt mắt, rõ ràng) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
          {STRATEGIC_PILLARS.map((st) => {
            const isDone = st.id < currentStep;
            const isCurrent = st.id === currentStep;
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                className={`p-3 rounded-2xl transition-all border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/30'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-black">
                    <Icon className="w-3.5 h-3.5" />
                    <span>0{st.id}</span>
                  </div>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-xs font-black truncate">{st.short}</div>
                <div className="text-[10px] truncate opacity-80 mt-0.5">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN GRID: STREAM PHỎNG VẤN TRỰC TIẾP (8 COLS) + BẢN ĐỒ TIẾN TRÌNH THỰC TẾ (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CỘT TRÁI (8 COLS): STREAM HỘI THOẠI AI CHUẨN THÔNG MINH */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 h-[620px] flex flex-col shadow-xs overflow-hidden">
          
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-sm shadow-2xs'
                        : 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        isAi ? 'text-slate-400 font-medium' : 'text-blue-100 font-medium'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                  AI
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="font-semibold">AI đang phân tích dữ liệu và bóc tách điểm nghẽn...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Answers Bar (1-Click Buttons) */}
          {latestAiMessage?.quickAnswers && latestAiMessage.quickAnswers.length > 0 && !isLoading && (
            <div className="px-4 py-2.5 bg-blue-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-black text-blue-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Gợi ý nhanh:
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {latestAiMessage.quickAnswers.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAnswer(opt)}
                    className="text-xs text-slate-700 bg-white hover:bg-blue-600 hover:text-white font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-600 shrink-0 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Common Pain Point Hot Tags */}
          <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">
              Điểm nghẽn mẫu:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {COMMON_PAIN_POINTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertPainPoint(item.text)}
                  className="text-[11px] text-slate-600 bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 transition-all whitespace-nowrap cursor-pointer font-medium"
                  title="Bấm để chèn vào câu trả lời"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            {isRecording && (
              <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-700 font-bold animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span>Đang ghi âm tiếng Việt... Anh/chị hãy nói tự nhiên, xong bấm "Gửi".</span>
                </div>
                <button
                  onClick={toggleRecording}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-xl text-[11px] font-bold"
                >
                  Xong
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                title={isRecording ? 'Dừng ghi âm' : 'Bật mic nói tiếng Việt'}
                className={`p-3 rounded-2xl transition-all shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-md animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAnswer();
                    }
                  }}
                  placeholder={
                    isRecording
                      ? 'Đang nhận diện giọng nói...'
                      : 'Nhập câu trả lời của CEO (Nhấn Enter để gửi)...'
                  }
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 resize-none font-medium"
                />
              </div>

              <button
                onClick={() => handleSendAnswer()}
                disabled={!inputVal.trim() || isLoading}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-sm mb-1 cursor-pointer"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
              <span>💡 Có thể gõ bàn phím hoặc chọn nhanh các nút gợi ý phía trên.</span>
              <span>Lượt trao đổi: #{conversationCount}</span>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (4 COLS): TIẾN ĐỘ THỰC TẾ & BẢN ĐỒ CHIẾN LƯỢC SỐNG */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Độ sắc bén dữ liệu */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Độ Sắc Bén Dữ Liệu
                </h3>
              </div>
              <span className="text-xs font-black text-blue-700">{dataConfidence}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(dataConfidence, 20)}%` }}
              ></div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium leading-relaxed">
              {dataConfidence >= 75
                ? '✅ AI đã có đủ dữ kiện thực tiễn sắc bén để hoàn thành 9 ô Canvas và Lộ trình 90 ngày.'
                : '⚡ Hãy tiếp tục trả lời hoặc bấm "Xem Dashboard Ngay" để tổng hợp báo cáo tự động.'}
            </div>

            {/* Điểm nghẽn vừa bóc tách */}
            {detectedBottlenecks.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Điểm nghẽn vừa phát hiện:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectedBottlenecks.map((bn, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full"
                    >
                      {bn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: 6 Bento Tiles Dữ Liệu Trích Xuất Thời Gian Thực */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Dữ Liệu Khám Sống
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Trực tiếp</span>
            </div>

            <div className="space-y-2 text-xs">
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  01. Sản phẩm cốt lõi
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {extractedData.coreProduct || <span className="text-slate-400 italic font-normal">Đang chờ CEO...</span>}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  02. Khách hàng trọng tâm
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {extractedData.targetCustomer || <span className="text-slate-400 italic font-normal">Đang bóc tách...</span>}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  03. Kênh tiếp cận &amp; Lợi thế
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {extractedData.coreAdvantage || extractedData.mainChannel || <span className="text-slate-400 italic font-normal">Đang bóc tách...</span>}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  04. Rò rỉ dòng tiền &amp; Mua lại
                </div>
                <div className="font-bold text-rose-700 truncate">
                  {extractedData.cashflowLeak || <span className="text-slate-400 italic font-normal">Đang bóc tách...</span>}
                </div>
              </div>

            </div>

            {/* Direct CTA Button to finish and view results */}
            <button
              onClick={() => handleCompleteCheckup()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Xuất Bản Báo Cáo &amp; Xem Dashboard</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
