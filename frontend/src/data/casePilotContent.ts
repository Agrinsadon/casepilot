import type {
  Attachment,
  EvidenceItem,
  InvestigationRow,
  PlanStep,
  SectionKey,
  SectionStatus,
  Tone,
  TraceStep,
} from "@/types/casepilot";

export const DEFAULT_CUSTOMER_NAME = "Laura Virtanen";
export const DEFAULT_INCIDENT_TYPE = "Water damage";
export const DEFAULT_CUSTOMER_MESSAGE =
  "Yesterday I noticed water coming through the kitchen ceiling. The upstairs apartment apparently had a dishwasher leak. I have attached photos and the repair company's initial report.";

export const CASE_ID = "CASE #2026-1842";
export const CASE_RECEIVED = "RECEIVED 18 AUG 2026 · 14:32";

export const ATTACHMENTS: Attachment[] = [
  { name: "customer-message.pdf", meta: "PDF · 1 page" },
  { name: "policy.pdf", meta: "PDF · 22 pages" },
  { name: "damage-photo-01.jpg", meta: "JPG · 4.1 MB" },
  { name: "damage-photo-02.jpg", meta: "JPG · 3.8 MB" },
  { name: "repair-report.pdf", meta: "PDF · 6 pages" },
  { name: "previous-claim.pdf", meta: "PDF · 3 pages" },
];

export const TRY_SIM_ATTACHMENTS = [
  "customer-message.pdf",
  "damage-photo-01.jpg",
  "repair-report.pdf",
];

export const PLAN_STEPS: PlanStep[] = [
  { n: "01", title: "Identify customer", desc: "Match claimant identity against policyholder records." },
  { n: "02", title: "Read damage report", desc: "Parse repair company findings and cause of loss." },
  { n: "03", title: "Inspect policy", desc: "Retrieve applicable coverage sections and conditions." },
  { n: "04", title: "Search previous claims", desc: "Check claim history for related or repeat incidents." },
  { n: "05", title: "Determine coverage", desc: "Evaluate damage against policy terms." },
  { n: "06", title: "Identify missing evidence", desc: "Flag information required to reach a confident decision." },
  { n: "07", title: "Recommend next action", desc: "Produce an explainable recommendation or request more evidence." },
];

export const INVESTIGATION_ROWS: InvestigationRow[] = [
  { title: "Customer lookup", status: "IDENTITY VERIFIED", simple: true, detail: "Laura Virtanen" },
  { title: "Document analysis", status: "COMPLETE", simple: true, detail: "6 documents processed" },
  {
    title: "Policy search",
    status: "MATCH FOUND",
    hasFields: true,
    label1: "Search query",
    value1: "water damage dishwasher leak",
    label2: "Relevant section",
    value2: "Home Insurance §4.2 — Water damage coverage",
  },
  {
    title: "Previous claims",
    status: "CHECKED",
    hasFields: true,
    label1: "2023",
    value1: "Storm damage",
    label2: "Relationship",
    value2: "No relationship detected",
  },
  {
    title: "Damage assessment",
    status: "ASSESSED",
    hasFields: true,
    label1: "Cause",
    value1: "Dishwasher leak",
    label2: "Estimated damage",
    value2: "€4,200",
    label3: "Coverage",
    value3: "Likely covered",
  },
];

export const EVIDENCE: EvidenceItem[] = [
  {
    label: "Active policy",
    sourceLabel: "policy.pdf · page 14",
    doc: "policy.pdf",
    page: 14,
    passage:
      "Sudden and unexpected water damage caused by a household appliance may be covered when reported within policy terms.",
  },
  {
    label: "Covered damage type",
    sourceLabel: "policy.pdf · page 14",
    doc: "policy.pdf",
    page: 14,
    passage:
      "Sudden and unexpected water damage caused by a household appliance may be covered when reported within policy terms.",
  },
  {
    label: "Repair report",
    sourceLabel: "repair-report.pdf · page 3",
    doc: "repair-report.pdf",
    page: 3,
    passage:
      "The leak originated from the dishwasher supply line in the upstairs unit and migrated through the ceiling assembly.",
  },
  {
    label: "Leak duration confirmed",
    sourceLabel: "repair-company-response",
    doc: "repair-company-response",
    page: null,
    passage: "The leak appears to have started approximately two hours before it was discovered.",
  },
  {
    label: "Customer identity verified",
    sourceLabel: "policy.pdf · page 2",
    doc: "policy.pdf",
    page: 2,
    passage: "Policyholder: Laura Virtanen — Policy #FI-2291-04, active since 2021.",
  },
];

export const TRACE_STEPS: TraceStep[] = [
  { label: "Customer message" },
  { label: "Water damage detected" },
  { label: "Policy §4.2 retrieved", sub: "policy.pdf · page 14" },
  { label: "Coverage conditions checked" },
  { label: "Missing leak duration detected", color: "var(--color-orange)" },
  { label: "Additional information requested" },
  { label: "Repair company response received" },
  { label: "Confidence 78% → 94%", size: 40 },
  { label: "APPROVE", sub: "Recommendation", size: 56, weight: 800, color: "var(--color-lime)", hasArrow: false },
];

export const SECTION_TONE: Record<SectionKey | "landing", Tone> = {
  landing: "ink",
  case: "paper",
  plan: "ink",
  investigation: "paper",
  missing: "ink",
  next: "paper",
  review: "ink",
  arrived: "paper",
  confidence: "ink",
  recommendation: "paper",
  trace: "ink",
  final: "paper",
};

const STATUS_BASE: Partial<Record<SectionKey, Omit<SectionStatus, "color"> & { color?: string }>> = {
  case: { label: "UNCERTAIN", color: "var(--color-purple)" },
  plan: { label: "UNCERTAIN", color: "var(--color-purple)" },
  investigation: { label: "INVESTIGATING" },
  missing: { label: "MISSING EVIDENCE", color: "var(--color-orange)" },
  next: { label: "MISSING EVIDENCE", color: "var(--color-orange)" },
  review: { label: "WAITING FOR HUMAN", color: "var(--color-purple)" },
  arrived: { label: "NEW INFORMATION", color: "var(--color-orange)" },
  confidence: { label: "NEW INFORMATION", color: "var(--color-orange)" },
  recommendation: { label: "READY FOR RECOMMENDATION", color: "var(--color-green)" },
  trace: { label: "READY FOR RECOMMENDATION", color: "var(--color-green)" },
  final: { label: "READY FOR RECOMMENDATION", color: "var(--color-green)" },
};

export function getSectionStatus(key: SectionKey | "landing", navFg: string): SectionStatus | null {
  const entry = STATUS_BASE[key as SectionKey];
  if (!entry) return null;
  return { label: entry.label, color: entry.color ?? navFg };
}
