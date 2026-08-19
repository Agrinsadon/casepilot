export type Phase = "landing" | "transitioning" | "tryForm" | "app";

export type SectionKey =
  | "case"
  | "plan"
  | "investigation"
  | "missing"
  | "next"
  | "review"
  | "arrived"
  | "confidence"
  | "recommendation"
  | "trace"
  | "final";

export type Tone = "ink" | "paper";

export type ApprovalStatus = "draft" | "sending" | "sent";

export interface Attachment {
  name: string;
  meta: string;
}

export interface PlanStep {
  n: string;
  title: string;
  desc: string;
}

export interface InvestigationRow {
  title: string;
  status: string;
  simple?: boolean;
  detail?: string;
  hasFields?: boolean;
  label1?: string;
  value1?: string;
  label2?: string;
  value2?: string;
  label3?: string;
  value3?: string;
}

export interface EvidenceItem {
  label: string;
  sourceLabel: string;
  doc: string;
  page: number | null;
  passage: string;
}

export interface TraceStep {
  label: string;
  sub?: string;
  size?: number;
  weight?: number;
  color?: string;
  hasArrow?: boolean;
}

export interface SectionStatus {
  label: string;
  color: string;
}
