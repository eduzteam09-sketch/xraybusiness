import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Users,
  Target,
  BarChart3,
  Layers,
  Award,
  ChevronRight,
  RotateCcw,
  Zap,
  Check,
  Flame,
  Clock,
  ShieldCheck,
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
  { id: 1, title: '01. Mô hình & Sản phẩm', desc: 'Sản phẩm cốt lõi & Lợi thế', icon: Building2 },
  { id: 2, title: '02. Khách hàng mục tiêu', desc: 'Nhóm khách hàng trả tiền', icon: Users },
  { id: 3, title: '03. Kênh bán & Tiếp cận', desc: 'Kênh tiếp cận & Chi phí tìm khách', icon: Target },
  { id: 4, title: '04. Dòng tiền & Rò rỉ', desc: 'Giữ chân, công nợ & Điểm nghẽn', icon: BarChart3 },
  { id: 5, title: '05. Vận hành & Phụ thuộc', desc: 'Mức độ phụ thuộc vào CEO', icon: Award },
  { id: 6, title: '06. Đột phá 90 ngày', desc: 'Mục tiêu & Sẵn sàng số hóa/AI', icon: Layers },
];

const COMMON_PAIN_POINTS = [
  { label: '📉 Khách mua 1 lần rồi thôi', text: 'Khách hàng mua một lần rồi ít khi quay lại, chi phí tìm khách mới ngày càng cao.' },
  { label: '💰 Chi phí quảng cáo đắt đỏ', text: 'Chi phí chạy quảng cáo Facebook/TikTok tăng nhanh nhưng biên lợi nhuận bị bào mòn.' },
  { label: '⏳ CEO ôm đồm nhiều việc', text: 'Việc gì cũng tới tay CEO từ bán hàng tới xử lý phát sinh, thiếu quy trình cho nhân viên.' },
  { label: '📦 Đọng vốn hàng tồn / Công nợ', text: 'Dòng tiền mặt bị kẹt ở công nợ khách hàng và hàng tồn kho quay vòng chậm.' },
  { label: '👥 Nhân sự thiếu chủ động', text: 'Đội ngũ làm việc bị động, chưa có người gánh vác các vị trí chủ chốt.' },
  { label: '📊 Quản lý thủ công / Chưa có CRM', text: 'Dữ liệu khách hàng còn lưu phân tán ở sổ sách và Excel, chưa có hệ thống chăm sóc tự động.' },
];

export const CheckupInterview: React.FC<CheckupInterviewProps> = ({
  initialProfile,
  onDiagnosisComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [mode, setMode] = useState<'standard' | 'deep'>('standard');
  const [isDrillDown, setIsDrillDown] = useState<boolean>(false);
  const [dataConfidence, setDataConfidence] = useState<number>(25);
  const [detectedBottlenecks, setDetectedBottlenecks] = useState<string[]>([]);
  const [conversationCount, setConversationCount] = useState<number>(1);

  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Chào anh/chị ${initialProfile.ceoName || 'CEO'}. Hãy xem buổi khám này như một cuộc trao đổi chiến lược thẳng thắn giữa hai cộng sự kinh doanh.\n\nAnh/chị có thể thoải mái gõ bàn phím theo cách diễn đạt thường ngày hoặc bấm chọn các gợi ý nhanh bên dưới. AI sẽ tự động phân tích và chuyển hóa thông tin thành Bản Đồ 9 Danh Mục chuẩn quốc tế.\n\nCâu hỏi khởi động: Sản phẩm hoặc dịch vụ cốt lõi mang lại doanh thu chính cho ${initialProfile.businessName || 'doanh nghiệp'} hiện nay là gì?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickAnswers: [
        'Sản xuất & Chế biến thực phẩm tiêu dùng',
        'Kinh doanh bán lẻ / Chuỗi cửa hàng phân phối',
        'Dịch vụ tư vấn / Đào tạo / B2B chuyên môn',
        'Phần mềm công nghệ & Giải pháp số hóa',
      ],
      stepIndex: 1,
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [recognizedVoiceSupport, setRecognizedVoiceSupport] = useState<boolean>(true);

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
  }>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech API setup (optional voice input)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognizedVoiceSupport(false);
      return;
    }

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

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói. Anh/chị có thể nhập trực tiếp bằng bàn phím hoặc bấm các nút gợi ý nhanh.');
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
        console.warn('Recognition start issue:', err);
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

    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setInputVal('');

    // Append User Message
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

    // Update real-time extracted data
    updateExtractedInsights(currentStep, text);

    // Advance state with AI
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

      // Track data confidence
      if (aiReply.dataConfidencePercent) {
        setDataConfidence((prev) => Math.max(prev, aiReply.dataConfidencePercent || 0));
      } else {
        setDataConfidence((prev) => Math.min(95, prev + 14));
      }

      // Track detected bottlenecks
      if (aiReply.detectedBottleneck) {
        setDetectedBottlenecks((prev) =>
          prev.includes(aiReply.detectedBottleneck!)
            ? prev
            : [...prev, aiReply.detectedBottleneck!]
        );
      }

      // Check if this was a drill-down
      const nextIsDrillDown = Boolean(aiReply.isDrillDown);
      setIsDrillDown(nextIsDrillDown);

      // If it was a drill down question, we stay on the current pillar to resolve it.
      // If not, we move forward to the next pillar.
      let nextStep = currentStep;
      if (!nextIsDrillDown && currentStep < 6) {
        nextStep = currentStep + 1;
      }
      setCurrentStep(nextStep);

      // Construct AI message
      const aiMsg: InterviewMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `${aiReply.acknowledgement}\n\n${aiReply.nextQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickAnswers: aiReply.quickAnswers,
        stepIndex: nextStep,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If AI determined that all key metrics are ready or we reached end of 6 pillars and completed drill-downs
      if (aiReply.readyToFinalize && currentStep >= 6 && !nextIsDrillDown) {
        // Automatically trigger finalization if completed last step
        setTimeout(() => {
          handleCompleteCheckup([...newHistory, aiMsg]);
        }, 1200);
      }
    } catch (err) {
      console.error('Error getting AI step reply:', err);
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

  const handleCompleteCheckup = async (history: InterviewMessage[]) => {
    setIsFinalizing(true);
    try {
      const diagnosisResult = await generateFullDiagnosis(profile, history);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe ignore
      }

      onDiagnosisComplete(diagnosisResult);
    } catch (e) {
      console.error('Finalize diagnosis failed:', e);
      setIsFinalizing(false);
    }
  };

  // Confidence category badge
  const getConfidenceBadge = () => {
    if (dataConfidence >= 75) {
      return {
        label: 'Dữ liệu rất sắc bén & vững chắc',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    }
    if (dataConfidence >= 50) {
      return {
        label: 'Khá đầy đủ cho 9 danh mục',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        dot: 'bg-blue-500',
      };
    }
    return {
      label: 'Đang thu thập dữ liệu nền tảng',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      dot: 'bg-amber-500',
    };
  };

  const badge = getConfidenceBadge();

  if (isFinalizing) {
    return (
      <div
        id="interview-finalizing-screen"
        className="max-w-2xl mx-auto py-20 px-6 text-center space-y-6"
      >
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-30"></div>
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            AI ĐANG TỔNG HỢP VÀ VẼ BẢN ĐỒ DOANH NGHIỆP...
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Chuyên gia AI đang phân tích dữ liệu 9 ô Canvas, bóc tách các điểm nghẽn rò rỉ dòng tiền và đóng gói Kế hoạch hành động 90 ngày cho CEO {profile.ceoName}.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-600">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã chuẩn hóa mô hình Canvas 9 ô chiến lược</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã phát hiện điểm nghẽn rò rỉ dòng tiền & khách cũ</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Đang hoàn tất Lộ trình 90 ngày & Đề xuất AI...</span>
          </div>
        </div>
      </div>
    );
  }

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* Top Header & Adaptive Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Phòng khám chiến lược thích ứng
              </span>
              <span className="text-xs text-slate-500">
                Doanh nghiệp: <strong className="text-slate-800">{profile.businessName}</strong> ({profile.industry || 'Kinh doanh'})
              </span>
              {isDrillDown && (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  Đang bóc tách điểm nghẽn
                </span>
              )}
            </div>
            <h1 className="text-lg font-black text-slate-900 mt-1">
              TRỤ CỘT: {STRATEGIC_PILLARS[currentStep - 1]?.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode selector */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('standard')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  mode === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Khám tiêu chuẩn qua các trụ cột chính"
              >
                Tiêu Chuẩn
              </button>
              <button
                type="button"
                onClick={() => setMode('deep')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  mode === 'deep'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Khám chuyên sâu: AI sẽ đào sâu vào các rò rỉ dòng tiền và vận hành"
              >
                <Zap className="w-3 h-3" />
                Chuyên Sâu
              </button>
            </div>

            <button
              id="interview-cancel-btn"
              onClick={onCancel}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              Lưu & Thoát
            </button>

            {/* Confidence progress */}
            <div className="text-right min-w-[140px]">
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-900">
                <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                <span>ĐỘ ĐẦY ĐỦ: {dataConfidence}%</span>
              </div>
              <div className="w-36 bg-slate-100 rounded-full h-2 mt-1 overflow-hidden border border-slate-200 ml-auto">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(dataConfidence, 15)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Pillars Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-100">
          {STRATEGIC_PILLARS.map((st) => {
            const isDone = st.id < currentStep;
            const isCurrent = st.id === currentStep;
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                className={`p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] mb-0.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{st.title.split('.')[1] || st.title}</span>
                </div>
                <div className="text-[10px] truncate opacity-85">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Conversation Stream + Realtime Strategy Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Conversational Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 h-[640px] shadow-xs overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                        : 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 text-right ${
                        isAi ? 'text-slate-400' : 'text-blue-200'
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
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  AI
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                  <span>AI đang lắng nghe và suy ngẫm điểm nghẽn chiến lược...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Answers Bar (1-Click Answer Chips) */}
          {latestAiMessage?.quickAnswers && latestAiMessage.quickAnswers.length > 0 && !isLoading && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Gợi ý nhanh:
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {latestAiMessage.quickAnswers.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAnswer(opt)}
                    className="text-xs text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 font-medium px-3 py-1.5 rounded-full border border-slate-200 shrink-0 transition-colors shadow-2xs whitespace-nowrap"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pain Point Hot Tags (Click to append into text input) */}
          <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Điểm nghẽn phổ biến:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {COMMON_PAIN_POINTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertPainPoint(item.text)}
                  className="text-[11px] text-slate-600 bg-white hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 px-2.5 py-1 rounded-md border border-slate-200 shrink-0 transition-colors whitespace-nowrap"
                  title="Bấm để chèn vào ô nhập câu trả lời"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Box Area (Optimized for comfortable typing) */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            {isRecording && (
              <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-700 font-semibold animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span>Đang nhận diện giọng nói... Anh/chị hãy nói tự nhiên, xong bấm "Gửi".</span>
                </div>
                <button
                  onClick={toggleRecording}
                  className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px]"
                >
                  Xong
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Optional Voice Mic button */}
              <button
                id="mic-voice-toggle-btn"
                type="button"
                onClick={toggleRecording}
                title={isRecording ? 'Dừng ghi âm' : 'Bật mic nói tiếng Việt (tùy chọn)'}
                className={`p-3 rounded-xl transition-all shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-md animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Enhanced Text Input Area */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  id="interview-text-input"
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
                      : 'Nhập câu trả lời của anh/chị tại đây (Nhấn Enter để gửi, Shift+Enter để xuống dòng)...'
                  }
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all text-slate-900 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="interview-send-btn"
                onClick={() => handleSendAnswer()}
                disabled={!inputVal.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-xs mb-1"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>💡 Có thể gõ văn bản tự nhiên hoặc bấm nút gợi ý phía trên để phản hồi nhanh.</span>
              <span className="hidden sm:inline">Lượt trao đổi: #{conversationCount}</span>
            </div>
          </div>
        </div>

        {/* Right: Live Extracted Blueprint & Confidence Meter (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            {/* Status Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dữ Liệu Khám Bệnh Động
                </h3>
              </div>
            </div>

            {/* Confidence status banner */}
            <div className={`p-3 rounded-xl border text-xs mb-4 ${badge.color}`}>
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{badge.label} ({dataConfidence}%)</span>
              </div>
              <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                {dataConfidence >= 75
                  ? 'AI đã có đủ cơ sở thực tiễn để lập báo cáo 9 danh mục sắc bén với độ chính xác cao.'
                  : 'Cung cấp thêm chi tiết về dòng tiền và vận hành để tăng độ chính xác của các khuyến nghị.'}
              </p>
            </div>

            {/* Detected Bottlenecks Badge List */}
            {detectedBottlenecks.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Điểm nghẽn vừa bóc tách:
                </div>
                <div className="flex flex-wrap gap-1">
                  {detectedBottlenecks.map((bn, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md"
                    >
                      {bn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Live extracted fields */}
            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  01. Sản phẩm & Mô hình cốt lõi
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                  {extractedData.coreProduct || (
                    <span className="text-slate-400 italic">Đang bóc tách...</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  02. Khách hàng trọng tâm
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                  {extractedData.targetCustomer || (
                    <span className="text-slate-400 italic">Đang bóc tách...</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  03. Kênh tiếp cận & Lợi thế
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                  {extractedData.mainChannel || extractedData.coreAdvantage || (
                    <span className="text-slate-400 italic">Đang bóc tách...</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  04. Dòng tiền & Tỷ lệ quay lại
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                  {extractedData.cashflowLeak || extractedData.repeatPurchaseMechanism || (
                    <span className="text-slate-400 italic">Đang bóc tách...</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  05. Vận hành & Phụ thuộc CEO
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                  {extractedData.ceoBottleneck || (
                    <span className="text-slate-400 italic">Đang bóc tách...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick finalize button */}
            {conversationCount >= 4 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  id="force-complete-checkup-btn"
                  onClick={() => handleCompleteCheckup(messages)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tổng Hợp Báo Cáo 9 Danh Mục Ngay</span>
                </button>
                <div className="text-[10px] text-slate-400 text-center mt-1">
                  Bấm nút này nếu anh/chị đang gấp và muốn xem kết quả ngay lập tức
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
