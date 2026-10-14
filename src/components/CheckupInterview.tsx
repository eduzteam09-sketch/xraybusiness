import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  Target,
  BarChart3,
  Layers,
  Award,
  Zap,
  Flame,
  ArrowLeft,
  Volume2,
  VolumeX,
  MessageSquare,
  Radio,
  RotateCcw,
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

export const CheckupInterview: React.FC<CheckupInterviewProps> = ({
  initialProfile,
  onDiagnosisComplete,
  onCancel,
}) => {
  const [profile] = useState<BusinessProfile>(initialProfile);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDrillDown, setIsDrillDown] = useState<boolean>(false);
  const [dataConfidence, setDataConfidence] = useState<number>(20);

  // Interaction options
  const [channel, setChannel] = useState<InteractionChannel>('chat');
  const [depth, setDepth] = useState<InteractionDepth>('standard');

  const [detectedBottlenecks, setDetectedBottlenecks] = useState<string[]>([]);
  const [conversationCount, setConversationCount] = useState<number>(1);

  // Voice speech synthesis sound state
  const [isAiVoiceMuted, setIsAiVoiceMuted] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Auto report generation flag when 100% reached
  const [isAutoGenerating, setIsAutoGenerating] = useState<boolean>(false);

  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Xin chào CEO ${initialProfile.ceoName || 'Lãnh Đạo'}. Hãy xem đây như một buổi tư vấn chiến lược trực tiếp giữa hai cộng sự điều hành.\n\nAnh/chị có thể chọn Nhắn tin hoặc chuyển sang Giọng nói để đối thoại trực tiếp. Khi thu thập đủ 100% dữ liệu, hệ thống sẽ tự động tạo Báo cáo Chiến lược.\n\nKhởi động: Sản phẩm hoặc dịch vụ cốt lõi mang lại dòng doanh thu chính cho ${initialProfile.businessName || 'doanh nghiệp'} hiện nay là gì?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickAnswers: [
        'Sản xuất & Chế biến thực phẩm (F&B / Bán buôn)',
        'Kinh doanh bán lẻ / Chuỗi phân phối',
        'Dịch vụ tư vấn / B2B / Giải pháp',
        'Bán hàng Online / Thương mại điện tử',
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
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to latest message in chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load and cache browser voices for optimal Vietnamese pronunciation
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Helper to pick the best Vietnamese female voice
  const getVietnameseFemaleVoice = (list: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!list || list.length === 0) return null;

    const viVoices = list.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('vi') ||
        v.lang.toLowerCase().includes('vi-vn') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt')
    );

    if (viVoices.length === 0) return null;

    // Prioritize natural female names
    const female = viVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('female') ||
        n.includes('nữ') ||
        n.includes('hoaimy') ||
        n.includes('linh') ||
        n.includes('mai') ||
        n.includes('chi') ||
        n.includes('an') ||
        n.includes('natural') ||
        n.includes('google')
      );
    });

    return female || viVoices[0];
  };

  // Natural Vietnamese Female Voice Engine
  const speakAiMessage = (rawText: string) => {
    if (isAiVoiceMuted) return;

    // Clean text: strip markdown symbols, asterisks, brackets, hashes
    const cleanText = rawText
      .replace(/[*_#>`~]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    // Cancel ongoing speech or audio
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }

    const currentVoices =
      voices.length > 0
        ? voices
        : typeof window !== 'undefined' && window.speechSynthesis
        ? window.speechSynthesis.getVoices()
        : [];

    const viVoice = getVietnameseFemaleVoice(currentVoices);

    // If browser provides a Vietnamese voice, use Web Speech API with tuned female pitch & rate
    if (typeof window !== 'undefined' && window.speechSynthesis && viVoice) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = viVoice;
        utterance.lang = viVoice.lang || 'vi-VN';
        utterance.pitch = 1.08; // Warm, natural female pitch
        utterance.rate = 0.96; // Articulate, clear speaking rate

        utterance.onstart = () => setIsAiSpeaking(true);
        utterance.onend = () => setIsAiSpeaking(false);
        utterance.onerror = () => setIsAiSpeaking(false);

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    }

    // High quality fallback via Google Vietnamese Female audio stream
    try {
      setIsAiSpeaking(true);
      const textToPlay = cleanText.length > 200 ? cleanText.slice(0, 195) + '...' : cleanText;
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(
        textToPlay
      )}`;
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => setIsAiSpeaking(false);
      audio.onerror = () => {
        // Last-ditch native fallback
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(cleanText);
          u.lang = 'vi-VN';
          u.pitch = 1.1;
          u.rate = 0.95;
          u.onstart = () => setIsAiSpeaking(true);
          u.onend = () => setIsAiSpeaking(false);
          u.onerror = () => setIsAiSpeaking(false);
          window.speechSynthesis.speak(u);
        } else {
          setIsAiSpeaking(false);
        }
      };

      audio.play().catch(() => {
        setIsAiSpeaking(false);
      });
    } catch {
      setIsAiSpeaking(false);
    }
  };

  // Read latest AI message aloud immediately when in voice mode
  useEffect(() => {
    if (channel === 'voice' && !isAiVoiceMuted) {
      const latestAi = [...messages].reverse().find((m) => m.sender === 'ai');
      if (latestAi) {
        const timer = setTimeout(() => {
          speakAiMessage(latestAi.text);
        }, 350);
        return () => clearTimeout(timer);
      }
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsAiSpeaking(false);
    }
  }, [channel, messages, isAiVoiceMuted]);

  // Web Speech Recognition for CEO voice input
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
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Toggle voice recording (CEO taps mic to speak or stop & send)
  const toggleRecordingInVoiceMode = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Bạn có thể chuyển sang chế độ Chat để nhập liệu thuận tiện.');
      return;
    }

    // If AI is currently speaking, stop it so CEO can talk
    if (isAiSpeaking) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsAiSpeaking(false);
    }

    if (isRecording) {
      // CEO finished speaking and tapped mic: automatically send
      recognitionRef.current.stop();
      setIsRecording(false);

      const capturedText = (voiceLiveTranscript || inputVal).trim();
      if (capturedText) {
        handleSendAnswer(capturedText);
      }
    } else {
      // Start recording
      try {
        setVoiceLiveTranscript('');
        setInputVal('');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Mic start error:', err);
      }
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

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
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
        // Tự động kích hoạt tổng hợp và chuyển dashboard sau 1.2 giây
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* 1. TOP HEADER & COMPACT CONTROLS */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 tracking-tight">
                  Phòng Khám Chiến Lược AI
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.businessName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                CEO: {profile.ceoName || 'Lãnh Đạo'} • Ngành: {profile.industry || 'Chưa chọn'}
              </p>
            </div>
          </div>

          {/* Right Action Bar: Channel Switch + Depth Switch + Return Home */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            
            {/* Chế độ tương tác: Chat vs Giọng Nói */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setChannel('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  channel === 'chat'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('voice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  channel === 'voice'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Giọng Nói</span>
              </button>
            </div>

            {/* Mức độ tương tác: Tiêu chuẩn vs Chuyên sâu */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setDepth('standard')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            <span className="font-black text-blue-700 text-[11px] whitespace-nowrap">
              {dataConfidence}% <span className="hidden sm:inline font-normal text-slate-400">• Đủ 100% tự động tạo báo cáo</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. KHÔNG GIAN TƯƠNG TÁC CHÍNH (ƯU TIÊN DIỆN TÍCH CHO MÀN HÌNH CHAT HOẶC VOICE) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        
        {/* ======================================================== */}
        {/* CHẾ ĐỘ 1: GIAO DIỆN CHAT NHẮN TIN TINH GỌN (ĐÃ LÀM GỌN, TẠM BỎ MIC Ở ĐÂY) */}
        {/* ======================================================== */}
        {channel === 'chat' && (
          <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            
            {/* Stream tin nhắn trực quan */}
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

            {/* Quick Answers Bar (Gợi ý nhanh tinh tế nếu có) */}
            {latestAiMessage?.quickAnswers && latestAiMessage.quickAnswers.length > 0 && !isLoading && (
              <div className="px-4 py-2 bg-blue-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Gợi ý:
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {latestAiMessage.quickAnswers.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendAnswer(opt)}
                      className="text-xs text-slate-700 bg-white hover:bg-blue-600 hover:text-white font-semibold px-3 py-1 rounded-full border border-slate-200 hover:border-blue-600 shrink-0 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleek Input Bar at Bottom (Đã làm gọn & tạm bỏ Mic ở đây theo đúng yêu cầu) */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendAnswer();
                      }
                    }}
                    placeholder="Nhập câu trả lời hoặc chia sẻ của CEO (Nhấn Enter để gửi)..."
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 font-medium"
                  />
                </div>

                <button
                  onClick={() => handleSendAnswer()}
                  disabled={!inputVal.trim() || isLoading}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Gửi</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 text-center text-[11px] text-slate-400 font-medium">
                💡 Đủ 100% dữ liệu sẽ tự động tạo báo cáo chiến lược • Lượt trao đổi: #{conversationCount}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHẾ ĐỘ 2: GIAO DIỆN GIỌNG NÓI TỐI GIẢN CHUẨN VIP CALL */}
        {/* (Màn hình chỉ hiện Mic & trạng thái gọi, AI phát giọng nữ tiếng Việt rõ ràng, CEO bấm mic để nói) */}
        {/* ======================================================== */}
        {channel === 'voice' && (
          <div className="flex-1 flex flex-col justify-between items-center bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[520px]">
            
            {/* Ambient Aura Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* 1. Header: Cuộc gọi trực tiếp AI Strategic Advisor */}
            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CUỘC GỌI CHIẾN LƯỢC TRỰC TIẾP</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Cố Vấn Chiến Lược AI (Giọng Nữ)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Đối thoại 1-1 với CEO {profile.ceoName || 'Doanh Nghiệp'} • {profile.businessName}
              </p>
            </div>

            {/* 2. CENTER: MÀN HÌNH CHỈ HIỆN MIC VÀ HIỆU ỨNG SÓNG ÂM THANH SANG TRỌNG */}
            <div className="my-auto flex flex-col items-center justify-center relative z-10 py-6">
              
              {/* Outer Concentric Wave Rings */}
              <div className="relative flex items-center justify-center">
                
                {/* When AI is Speaking (Blue/Purple Ripple) */}
                {isAiSpeaking && (
                  <>
                    <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-blue-500/20 animate-ping pointer-events-none"></div>
                    <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-blue-400/40 animate-pulse pointer-events-none"></div>
                  </>
                )}

                {/* When CEO is Speaking / Recording (Crimson/Rose Glow) */}
                {isRecording && (
                  <>
                    <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-rose-500/25 animate-ping pointer-events-none"></div>
                    <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-rose-400/50 animate-pulse pointer-events-none"></div>
                  </>
                )}

                {/* When Idle Waiting for CEO (Gentle Cyan Breathing) */}
                {!isAiSpeaking && !isRecording && !isLoading && (
                  <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-slate-700/60 animate-pulse pointer-events-none"></div>
                )}

                {/* Big Center Microphone Button */}
                <button
                  type="button"
                  onClick={toggleRecordingInVoiceMode}
                  className={`relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                    isRecording
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 ring-8 ring-rose-500/30 shadow-rose-600/50 animate-pulse'
                      : isAiSpeaking
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 ring-6 ring-blue-500/30 shadow-blue-600/40'
                      : isLoading
                      ? 'bg-slate-800 ring-4 ring-slate-700 animate-pulse'
                      : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 ring-6 ring-cyan-500/20 shadow-cyan-500/30 hover:ring-cyan-400/40'
                  }`}
                  title={isRecording ? 'Nhấn để hoàn tất câu nói & gửi' : 'Nhấn mic để bắt đầu nói'}
                >
                  {isRecording ? (
                    <Mic className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce text-white" />
                  ) : isAiSpeaking ? (
                    <Volume2 className="w-12 h-12 sm:w-14 sm:h-14 animate-pulse text-white" />
                  ) : isLoading ? (
                    <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 animate-spin text-slate-300" />
                  ) : (
                    <Mic className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  )}

                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1 sm:mt-2 text-white/95">
                    {isRecording
                      ? 'Nhấn Gửi'
                      : isAiSpeaking
                      ? 'AI Đang Nói'
                      : isLoading
                      ? 'Đang Xử Lý'
                      : 'Nhấn Để Nói'}
                  </span>
                </button>
              </div>

              {/* Dynamic Status Indicator (Giống như đang gọi điện thoại) */}
              <div className="mt-7 text-center space-y-2">
                
                {isAiSpeaking ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-bold animate-pulse">
                    <span className="flex gap-1 items-end h-3">
                      <span className="w-1 bg-blue-400 h-2 animate-bounce"></span>
                      <span className="w-1 bg-blue-400 h-3 animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 bg-blue-400 h-2 animate-bounce [animation-delay:0.3s]"></span>
                    </span>
                    <span>AI đang đọc câu hỏi chiến lược...</span>
                  </div>
                ) : isRecording ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs sm:text-sm font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>Đang nghe CEO nói • Nhấn Micro lần nữa để Gửi</span>
                  </div>
                ) : isLoading ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs sm:text-sm font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>AI đang phân tích câu trả lời của CEO...</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Đến lượt CEO • Hãy nhấn Micro ở trên để trả lời</span>
                  </div>
                )}

                {/* Subtitle preview of CEO's words while speaking (chỉ hiện 1 dòng ngắn khi CEO đang nói để kiểm tra, không rườm rà) */}
                {isRecording && (voiceLiveTranscript || inputVal) && (
                  <div className="max-w-md mx-auto px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-rose-200 font-medium italic animate-fadeIn">
                    "{voiceLiveTranscript || inputVal}"
                  </div>
                )}
              </div>

            </div>

            {/* 3. Bottom Controls: Replay Audio + Mute/Unmute + Switch back to Chat */}
            <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 relative z-10 flex-wrap gap-2">
              
              {/* Nút nghe lại câu hỏi bằng giọng nữ AI */}
              <button
                type="button"
                onClick={() => {
                  if (latestAiMessage) {
                    speakAiMessage(latestAiMessage.text);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer shadow-xs"
                title="Bấm để AI đọc lại câu hỏi"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nghe lại câu hỏi</span>
              </button>

              {/* Tắt / Bật tiếng */}
              <button
                type="button"
                onClick={() => setIsAiVoiceMuted(!isAiVoiceMuted)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300 font-medium transition-all cursor-pointer"
              >
                {isAiVoiceMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Đã tắt tiếng</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Giọng Nữ Tiếng Việt</span>
                  </>
                )}
              </button>

              {/* Chuyển nhanh sang Chat */}
              <button
                type="button"
                onClick={() => setChannel('chat')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 font-bold border border-blue-500/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Đổi sang Chat</span>
              </button>

            </div>

          </div>
        )}

      </main>

      {/* 3. TIẾN TRÌNH CÁC BƯỚC NẰM GỌN GÀNG PHÍA DƯỚI (CHIẾM DIỆN TÍCH NHỎ, ƯU TIÊN MÀN HÌNH CHAT/VOICE) */}
      <footer className="w-full bg-white/95 backdrop-blur-xs border-t border-slate-200 py-2 sm:py-2.5 px-3 sm:px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {STRATEGIC_PILLARS.map((pillar) => {
            const isCompleted = pillar.id < currentStep;
            const isCurrent = pillar.id === currentStep;

            return (
              <div
                key={pillar.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border border-blue-300 text-blue-800 font-black shadow-2xs'
                    : isCompleted
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {pillar.id}
                  </span>
                )}
                <span>{pillar.short}</span>
              </div>
            );
          })}
        </div>
      </footer>

    </div>
  );
};
