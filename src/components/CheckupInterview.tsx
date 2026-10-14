import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
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
  ArrowLeft,
  Volume2,
  VolumeX,
  MessageSquare,
  Radio,
  Clock,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BusinessProfile, InterviewMessage, DiagnosisReport } from '../types';
import { askAiInterviewStep, generateFullDiagnosis, AiInterviewReply } from '../services/aiService';

interface CheckupInterviewProps {
  initialProfile: BusinessProfile;
  onDiagnosisComplete: (report: DiagnosisReport) => void;
  onCancel: () => void;
}

export type InteractionChannel = 'chat' | 'voice';
export type InteractionDepth = 'standard' | 'deep';

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
  // Mode selectors: Kênh tương tác (Chat / Voice) & Mức độ tương tác (Tiêu chuẩn / Chuyên sâu)
  const [channel, setChannel] = useState<InteractionChannel>('chat');
  const [depth, setDepth] = useState<InteractionDepth>('standard');

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile] = useState<BusinessProfile>(initialProfile);
  const [isDrillDown, setIsDrillDown] = useState<boolean>(false);
  const [dataConfidence, setDataConfidence] = useState<number>(25);
  const [detectedBottlenecks, setDetectedBottlenecks] = useState<string[]>([]);
  const [conversationCount, setConversationCount] = useState<number>(1);

  // Voice speech synthesis sound state
  const [isAiVoiceMuted, setIsAiVoiceMuted] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);

  // Auto report generation flag when 100% reached
  const [isAutoGenerating, setIsAutoGenerating] = useState<boolean>(false);

  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Xin chào CEO ${initialProfile.ceoName || 'Lãnh Đạo'}. Hãy xem đây như một phiên tư vấn chiến lược cấp cao trực tiếp giữa hai cộng sự điều hành.\n\nAnh/chị có thể chọn nhắn tin hoặc bấm sang biểu tượng Micro để đối thoại giọng nói. AI sẽ tự động phân tích và chuyển hóa vào Bản Đồ Chiến Lược Canvas 9 Danh Mục.\n\nKhởi động: Sản phẩm hoặc dịch vụ cốt lõi mang lại dòng doanh thu chính cho ${initialProfile.businessName || 'doanh nghiệp'} hiện nay là gì?`,
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
  const [voiceLiveTranscript, setVoiceLiveTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, voiceLiveTranscript]);

  // Read latest AI message aloud when in voice mode
  const speakText = (text: string) => {
    if (isAiVoiceMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      // Clean up markdown / newlines for voice clarity
      const cleanText = text.replace(/[*_#]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsAiSpeaking(false);
    }
  };

  // Trigger speech when channel is voice and AI sends a new message
  useEffect(() => {
    if (channel === 'voice' && !isAiVoiceMuted) {
      const latest = [...messages].reverse().find((m) => m.sender === 'ai');
      if (latest) {
        speakText(latest.text);
      }
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsAiSpeaking(false);
      }
    }
  }, [channel, messages, isAiVoiceMuted]);

  // Web Speech Recognition Setup
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
          const finalPiece = event.results[i][0].transcript;
          setInputVal((prev) => (prev ? prev + ' ' : '') + finalPiece);
          setVoiceLiveTranscript((prev) => (prev ? prev + ' ' : '') + finalPiece);
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      if (currentTranscript) {
        setVoiceLiveTranscript(currentTranscript);
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API tiếng Việt. Bạn có thể chọn nhanh gợi ý hoặc gõ phím.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        setVoiceLiveTranscript('');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Mic start error:', err);
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

  // Main submission handler
  const handleSendAnswer = async (textToSend?: string) => {
    const text = (textToSend || inputVal || voiceLiveTranscript).trim();
    if (!text || isLoading || isAutoGenerating) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Stop speaking if AI was speaking
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }

    setInputVal('');
    setVoiceLiveTranscript('');

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

    setIsLoading(true);

    // Calculate progression percentage
    const maxSteps = depth === 'deep' ? 8 : 6;
    const progressEstimate = Math.min(100, Math.round((newCount / maxSteps) * 100));
    setDataConfidence(progressEstimate);

    try {
      const aiReply: AiInterviewReply = await askAiInterviewStep(
        profile,
        currentStep,
        text,
        newHistory,
        depth,
        isDrillDown,
        newCount
      );

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

      const updatedHistory = [...newHistory, aiMsg];
      setMessages(updatedHistory);

      // KIỂM TRA ĐIỀU KIỆN 100% ĐỂ TỰ ĐỘNG TẠO BÁO CÁO (KHÔNG CẦN NHẤN GÌ HẾT)
      const isCompleteCondition =
        (depth === 'standard' && currentStep >= 6 && !nextIsDrillDown) ||
        (depth === 'deep' && newCount >= 8) ||
        aiReply.readyToFinalize === true ||
        progressEstimate >= 100;

      if (isCompleteCondition) {
        setDataConfidence(100);
        setIsAutoGenerating(true);
        // Tự động kích hoạt tổng hợp và chuyển dashboard sau 1 giây
        setTimeout(() => {
          handleCompleteCheckup(updatedHistory);
        }, 1200);
      }
    } catch (err) {
      console.error('Lỗi phân tích AI:', err);
    } finally {
      setIsLoading(false);
      if (channel === 'chat' && textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleCompleteCheckup = async (history?: InterviewMessage[]) => {
    setIsFinalizing(true);
    try {
      const historyToUse = history || messages;
      const diagnosisResult = await generateFullDiagnosis(profile, historyToUse);

      try {
        confetti({
          particleCount: 100,
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
      setIsAutoGenerating(false);
    }
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  // Loading or Auto-Generating 100% Screen
  if (isFinalizing || isAutoGenerating) {
    return (
      <div className="max-w-2xl mx-auto py-16 sm:py-24 px-4 text-center space-y-6 animate-fadeIn">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-40"></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl animate-pulse">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thu Thập Đủ 100% Dữ Liệu • Tự Động Tạo Báo Cáo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đang Tổng Hợp Bản Đồ Chiến Lược CEO...
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            Hệ thống đang chuẩn hóa 9 ô Canvas, đối chiếu 10 trục sức khỏe, bóc tách điểm nghẽn và hoàn thiện Lộ trình 90 ngày cho {profile.businessName}.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-5 text-left text-xs space-y-3 shadow-md">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thu thập đủ 100% dữ liệu phỏng vấn</span>
          </div>
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tự động kết xuất 9 ô Canvas &amp; Điểm nghẽn rò rỉ</span>
          </div>
          <div className="flex items-center gap-2.5 text-indigo-600 font-bold animate-pulse">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            <span>Đang chuyển hướng thẳng sang Dashboard Điều Hành...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between font-sans bg-slate-50">
      
      {/* 1. TOP HEADER COMPACT: THU GỌN TỐI ĐA ĐỂ ƯU TIÊN DIỆN TÍCH CHO PHÒNG KHÁM */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Clinic Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Phòng Khám Chiến Lược
                </span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[140px] sm:max-w-xs">
                  {profile.businessName}
                </span>
              </div>
            </div>
          </div>

          {/* 2 Chế độ (Chat / Giọng nói) & 2 Mức độ (Tiêu chuẩn / Chuyên sâu) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Chế độ tương tác: Chat vs Voice */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setChannel('chat')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  channel === 'chat'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Nhắn tin dạng chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('voice')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  channel === 'voice'
                    ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Đối thoại bằng giọng nói"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Giọng Nói</span>
              </button>
            </div>

            {/* Mức độ tương tác: Tiêu chuẩn vs Chuyên sâu */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDepth('standard')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  depth === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tiêu Chuẩn
              </button>
              <button
                type="button"
                onClick={() => setDepth('deep')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  depth === 'deep'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Chuyên Sâu</span>
              </button>
            </div>

            {/* Nút Về trang chủ thay vì Thoát */}
            <button
              onClick={onCancel}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về trang chủ</span>
            </button>
          </div>

        </div>

        {/* TIẾN TRÌNH THU NHỎ CHIẾM DIỆN TÍCH NHỎ (SLIM PROGRESS STRIP) */}
        <div className="w-full bg-slate-100 border-t border-slate-200/80 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">
              Trụ cột 0{currentStep}/06:
            </span>
            <span className="text-slate-700 font-medium hidden sm:inline">
              {STRATEGIC_PILLARS[currentStep - 1]?.title}
            </span>
            {isDrillDown && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                Đang bóc tách sâu
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-24 sm:w-36 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(dataConfidence, 20)}%` }}
              ></div>
            </div>
            <span className="font-black text-blue-700 text-[11px]">{dataConfidence}%</span>
          </div>
        </div>
      </header>

      {/* 2. KHÔNG GIAN TƯƠNG TÁC CHÍNH (ƯU TIÊN DIỆN TÍCH CHO MÀN HÌNH CHAT HOẶC VOICE) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        
        {/* ======================================================== */}
        {/* CHẾ ĐỘ 1: GIAO DIỆN CHAT NHẮN TIN TRỰC TIẾP (iMessage / ChatGPT) */}
        {/* ======================================================== */}
        {channel === 'chat' && (
          <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            
            {/* Stream tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs mt-0.5">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 sm:px-5 py-3 text-sm leading-relaxed ${
                        isAi
                          ? 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                          : 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div
                        className={`text-[10px] mt-1.5 text-right ${
                          isAi ? 'text-slate-400' : 'text-blue-100'
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
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                    AI
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                    <span className="font-semibold">AI đang phân tích câu trả lời của CEO...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Answers Bar (1-Click Buttons) */}
            {latestAiMessage?.quickAnswers && latestAiMessage.quickAnswers.length > 0 && !isLoading && (
              <div className="px-4 py-2 bg-blue-50/60 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
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
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">
                Thường gặp:
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

            {/* Pinned Input Bar at Bottom (Chuẩn như màn hình nhắn tin) */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
              
              {isRecording && (
                <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-700 font-bold animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                    <span>Đang ghi âm tiếng Việt: Hãy nói tự nhiên, xong bấm "Gửi".</span>
                  </div>
                  <button
                    onClick={toggleRecording}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-xl text-[11px] font-bold cursor-pointer"
                  >
                    Dừng
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                
                {/* Nút Mic nhanh */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  title={isRecording ? 'Dừng ghi âm' : 'Bật mic nói tiếng Việt'}
                  className={`p-3 rounded-2xl transition-all shrink-0 cursor-pointer ${
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
                  disabled={(!inputVal.trim() && !voiceLiveTranscript.trim()) || isLoading}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-sm mb-1 cursor-pointer"
                >
                  <span>Gửi</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
                <span>💡 Tự động xuất kết quả khi đạt đủ 100% dữ liệu</span>
                <span>Lượt trao đổi: #{conversationCount}</span>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHẾ ĐỘ 2: GIAO DIỆN GIỌNG NÓI VOICE AI ĐẲNG CẤP */}
        {/* ======================================================== */}
        {channel === 'voice' && (
          <div className="flex-1 flex flex-col justify-between bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center relative overflow-hidden min-h-[520px]">
            
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Voice Header Card: Câu hỏi hiện tại của AI */}
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>CHẾ ĐỘ ĐỐI THOẠI GIỌNG NÓI TRỰC TIẾP</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-left shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Cố Vấn Chiến Lược
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAiVoiceMuted(!isAiVoiceMuted)}
                    className="text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    title={isAiVoiceMuted ? 'Bật âm thanh AI đọc' : 'Tắt âm thanh AI đọc'}
                  >
                    {isAiVoiceMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
                    <span className="text-[10px]">{isAiVoiceMuted ? 'Đã tắt tiếng' : 'Đang bật tiếng'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {latestAiMessage?.text || 'Xin chào CEO, vui lòng nhấn micro bên dưới để bắt đầu chia sẻ...'}
                </p>
              </div>
            </div>

            {/* ORB MICROPHONE TRUNG TÂM NHẤP NHÁY TRẠNG THÁI (PULSING / BREATHING WAVE) */}
            <div className="py-6 sm:py-8 flex flex-col items-center justify-center relative z-10">
              
              {/* Outer Pulsing Wave Rings */}
              <div className="relative flex items-center justify-center">
                {isRecording && (
                  <>
                    <div className="absolute w-36 h-36 rounded-full bg-rose-400/20 animate-ping pointer-events-none"></div>
                    <div className="absolute w-48 h-48 rounded-full border border-rose-300 animate-pulse pointer-events-none"></div>
                  </>
                )}

                {isAiSpeaking && (
                  <div className="absolute w-40 h-40 rounded-full bg-blue-400/20 animate-pulse pointer-events-none"></div>
                )}

                {/* Big Mic Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                    isRecording
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/40 ring-4 ring-rose-400/30 animate-pulse'
                      : isAiSpeaking
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/30'
                      : 'bg-gradient-to-tr from-slate-900 to-indigo-950 shadow-slate-900/30 hover:bg-slate-800'
                  }`}
                >
                  {isRecording ? (
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
                  ) : (
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-slate-100" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                    {isRecording ? 'Đang Nghe' : 'Nhấn Để Nói'}
                  </span>
                </button>
              </div>

              {/* Status Note Trạng Thái Khi Đang Voice */}
              <div className="mt-5 space-y-1">
                <div className="text-sm font-black text-slate-800 flex items-center justify-center gap-2">
                  {isRecording ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                      <span className="text-rose-600">Micro đang bật • Hãy nói câu trả lời của CEO...</span>
                    </>
                  ) : isAiSpeaking ? (
                    <>
                      <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span className="text-blue-700">AI đang đọc câu hỏi chiến lược...</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Bấm vào biểu tượng Micro tròn để nói tiếng Việt</span>
                  )}
                </div>

                {/* Live Transcript Stream */}
                {(voiceLiveTranscript || inputVal) && (
                  <div className="max-w-xl mx-auto p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 font-medium italic mt-2 animate-fadeIn">
                    "{voiceLiveTranscript || inputVal}"
                  </div>
                )}
              </div>

              {/* Quick Action when speaking */}
              {(voiceLiveTranscript || inputVal) && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendAnswer()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Gửi câu trả lời này</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('');
                      setVoiceLiveTranscript('');
                    }}
                    className="px-3 py-2.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>

            {/* Quick Answer Chips Below Mic if User Prefers 1-Click */}
            {latestAiMessage?.quickAnswers && latestAiMessage.quickAnswers.length > 0 && (
              <div className="max-w-2xl mx-auto pt-2 relative z-10 w-full">
                <div className="text-[11px] font-bold text-slate-400 mb-2">
                  Hoặc bấm nhanh câu trả lời phù hợp:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {latestAiMessage.quickAnswers.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendAnswer(opt)}
                      className="text-xs text-slate-700 bg-white hover:bg-blue-600 hover:text-white font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-600 transition-all shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
};
