import type { Attachment, EvidenceItem, InvestigationRow, TraceStep } from "@/types/casepilot";
import type { CaseContext, CoverageAssessment, RecommendationType } from "@/types/investigation";

const RECOMMENDATION_COPY: Record<RecommendationType, { heading: string; color: string }> = {
  approve: { heading: "APPROVE CLAIM", color: "var(--color-green)" },
  deny: { heading: "CLAIM DENIED", color: "var(--color-orange)" },
  escalate_to_human: { heading: "NEEDS HUMAN REVIEW", color: "var(--color-purple)" },
  request_information: { heading: "MORE INFORMATION NEEDED", color: "var(--color-orange)" },
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function buildCustomAttachments(context: CaseContext): Attachment[] {
  const attachments: Attachment[] = [{ name: "your-description.txt", meta: "TEXT · your words" }];
  for (const name of context.attachment_names) {
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
    attachments.push({ name, meta: isImage ? "PHOTO · uploaded" : "DOCUMENT · uploaded" });
  }
  return attachments;
}

export function buildCustomInvestigationRows(
  context: CaseContext,
  assessment: CoverageAssessment
): InvestigationRow[] {
  const rows: InvestigationRow[] = [
    {
      title: "Your description",
      status: "REVIEWED",
      simple: true,
      detail: truncate(context.description, 160),
    },
  ];

  rows.push(
    context.policy_text
      ? {
          title: "Policy document",
          status: "ANALYZED",
          simple: true,
          detail: "Extracted coverage terms from your uploaded document.",
        }
      : {
          title: "Policy document",
          status: "NOT PROVIDED",
          simple: true,
          detail: "No policy document was uploaded — coverage terms could not be confirmed.",
        }
  );

  if (context.image_summaries.length > 0) {
    rows.push({
      title: "Damage photos",
      status: `${context.image_summaries.length} ANALYZED`,
      simple: true,
      detail: truncate(context.image_summaries[0], 160),
    });
  }

  rows.push({
    title: "Coverage assessment",
    status: assessment.covered.toUpperCase(),
    hasFields: true,
    label1: "Incident",
    value1: assessment.incident_type,
    label2: "Confidence",
    value2: `${assessment.confidence}%`,
  });

  return rows;
}

export function buildCustomEvidence(assessment: CoverageAssessment): EvidenceItem[] {
  return assessment.evidence.map((item) => ({
    label: item.label,
    sourceLabel: item.source,
    doc: item.source,
    page: null,
    passage: item.detail,
  }));
}

export function getRecommendationCopy(recommendation: RecommendationType): { heading: string; color: string } {
  return RECOMMENDATION_COPY[recommendation];
}

export function buildCustomTraceSteps(
  context: CaseContext,
  finalAssessment: CoverageAssessment,
  priorConfidence: number | null
): TraceStep[] {
  const steps: TraceStep[] = [{ label: "Your description received" }];

  if (context.image_summaries.length > 0) {
    steps.push({ label: `${context.image_summaries.length} photo(s) analyzed` });
  }
  if (context.policy_text) {
    steps.push({ label: "Policy document analyzed" });
  } else {
    steps.push({ label: "No policy document provided", color: "var(--color-orange)" });
  }

  if (priorConfidence !== null) {
    steps.push({ label: "Missing information detected", color: "var(--color-orange)" });
    steps.push({ label: "You provided an answer" });
    steps.push({ label: `Confidence ${priorConfidence}% → ${finalAssessment.confidence}%`, size: 40 });
  } else {
    steps.push({ label: `Confidence ${finalAssessment.confidence}%`, size: 40 });
  }

  const copy = getRecommendationCopy(finalAssessment.recommendation);
  steps.push({
    label: copy.heading,
    sub: "Recommendation",
    size: 56,
    weight: 800,
    color: copy.color,
    hasArrow: false,
  });

  return steps;
}
