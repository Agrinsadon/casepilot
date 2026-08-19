export interface EvidenceFinding {
  label: string;
  detail: string;
  source: string;
}

export interface MissingInformationItem {
  question: string;
  reason: string;
}

export type CoverageStatus = "likely" | "unlikely" | "uncertain";
export type RecommendationType = "approve" | "request_information" | "deny" | "escalate_to_human";

export interface CoverageAssessment {
  incident_type: string;
  summary: string;
  covered: CoverageStatus;
  confidence: number;
  reasoning: string;
  evidence: EvidenceFinding[];
  missing_information: MissingInformationItem[];
  estimated_compensation: string | null;
  recommendation: RecommendationType;
  next_action: string;
}

export interface ConversationTurn {
  questions: string[];
  answer: string;
}

export interface CaseContext {
  description: string;
  policy_text: string | null;
  image_summaries: string[];
  attachment_names: string[];
  conversation: ConversationTurn[];
}

export interface InvestigationResult {
  assessment: CoverageAssessment;
  context: CaseContext;
}

export interface ApiErrorBody {
  detail?: string | { msg?: string }[];
}
