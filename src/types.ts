export interface BusinessProfile {
  id: string;
  ceoName: string;
  businessName: string;
  industry: string;
  yearsInBusiness?: string;
  yearsInOperation?: number;
  currentRevenue?: string;
  numberOfStaff?: string;
  coreOfferings?: string;
  currentTools: string[];
  createdAt: string;
  lastCheckupDate?: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low'; // 🟢 Có cơ sở rõ | 🟡 Cần thêm thông tin | ⚪ Chưa đủ dữ liệu

export interface CanvasItem {
  id: string;
  title: string;
  englishSub: string;
  current: string[];
  aiFeedback: string;
  opportunity: string;
}

export interface Canvas9Model {
  customerSegments: CanvasItem;
  valuePropositions: CanvasItem;
  channels: CanvasItem;
  customerRelationships: CanvasItem;
  revenueStreams: CanvasItem;
  keyResources: CanvasItem;
  keyActivities: CanvasItem;
  keyPartners: CanvasItem;
  costStructure: CanvasItem;
}

export interface BottleneckItem {
  id: string;
  zone: 'Khách hàng' | 'Dữ liệu' | 'Vận hành' | 'Kênh phân phối' | 'Mở rộng quy mô';
  flowStep: 'Thị trường' | 'Khách hàng' | 'Bán hàng' | 'Vận hành' | 'Doanh thu' | 'Dòng tiền' | 'Tăng trưởng';
  title: string;
  severity: 'Rất cao' | 'Cao' | 'Trung bình' | 'Thấp';
  why: string;
  impact: string;
  recommendation: string;
  confidence: ConfidenceLevel;
  rootCauses: string[];
}

export interface RadarScoreItem {
  subject: string;
  vietnameseFull: string;
  category: 'Giá trị' | 'Khách hàng' | 'Tiếp cận' | 'Giữ chân & Tăng giá trị' | 'Dữ liệu' | 'Vận hành & Mở rộng';
  score: number; // 1 to 5
  benchmark: number; // 1 to 5
  note: string;
  moneyLeakNotice?: string;
}

export interface MoneyFlowItem {
  id: string;
  name: string;
  type: 'current' | 'potential';
  sourceProduct: string;
  targetCustomer: string;
  channel: string;
  frequency: string;
  shareOrEstimate: string;
  healthStatus: 'ổn định' | 'rủi ro' | 'tiềm năng lớn';
  description?: string;
}

export interface ActionPlanItem {
  id: string;
  priorityLabel: string; // e.g., "ƯU TIÊN 01 (0-30 ngày)"
  title: string;
  objective: string;
  actionItems: string[];
  kpi: string;
  timeline: string;
  expectedResult: string;
  status: 'done' | 'doing' | 'todo'; // ✅ Đã làm | 🟡 Đang làm | ❌ Chưa làm
}

export interface AiInitiative {
  title: string;
  whyPriority: string;
  impact: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao';
  suggestedTools: string[];
}

export interface DifferentiationArea {
  area: 'Sản phẩm' | 'Dịch vụ' | 'Trải nghiệm' | 'Mô hình kinh doanh' | 'Hệ sinh thái';
  title: string;
  description: string;
  hasEvidence: boolean; // Đã có bằng chứng / Chưa có đủ bằng chứng
  evidenceNote: string;
}

export interface StrategicOpportunity {
  id: string;
  title: string;
  whyAiFoundIt: string;
  whatCanBeDone: string;
  priority: 'Cao' | 'Trung bình';
  category: 'Khách hàng chưa phục vụ' | 'Nhu cầu chưa đáp ứng' | 'Sản phẩm bổ trợ' | 'Kênh mới' | 'Dòng tiền mới' | 'Số hóa & AI';
}

export interface ValueChainStep {
  step: string; // '01', '02', ..., '07'
  label: string; // 'THỊ TRƯỜNG' | 'KHÁCH HÀNG' | 'GIÁ TRỊ' | 'KHÁC BIỆT' | 'MÔ HÌNH' | 'DÒNG TIỀN' | 'TĂNG TRƯỞNG'
  status: 'strong' | 'warning' | 'danger' | 'normal';
  note: string; // Dynamic note tailored to the specific business
}

export interface DiagnosisReport {
  id: string;
  profile: BusinessProfile;
  createdAt: string;
  healthScore: number; // 0 - 100
  healthSummary: string;
  valueChainFlow?: ValueChainStep[]; // 7 bước dòng chảy chuỗi giá trị thực tế
  expertFlowAssessment?: string; // Nhận định chuyên gia về dòng chảy giá trị & rò rỉ dòng tiền
  threeKeyInsights: {
    greatestStrength: string;
    biggestBottleneck: string;
    mostPromisingOpportunity: string;
  };
  ifOnlyOneThing: {
    action: string;
    reason: string;
    leverageBottleneck: string;
  };
  positioningSummary: {
    marketLocation: string;
    targetTier: string;
    competitiveStand: string;
  };
  differentiation: DifferentiationArea[];
  canvas: Canvas9Model;
  bottlenecks: BottleneckItem[];
  rootCauseMap: {
    problemStatement: string;
    chain: {
      step: string;
      description: string;
    }[];
  };
  radarScores: RadarScoreItem[];
  moneyFlow: {
    summary: string;
    currentFlows: MoneyFlowItem[];
    potentialFlows: MoneyFlowItem[];
    transformationLogic: string;
  };
  digitalAndAi: {
    readinessScore: number; // 0 - 100
    levelTitle: string;
    currentTools: string[];
    missingCrucialTools: string[];
    initiatives: AiInitiative[];
  };
  opportunities: StrategicOpportunity[];
  ninetyDayPlan: ActionPlanItem[];
  confidence: {
    level: ConfidenceLevel;
    rationale: string;
    missingMetrics?: string[];
  };
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickAnswers?: string[];
  stepIndex?: number;
}
