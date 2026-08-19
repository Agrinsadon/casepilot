import type { ApiErrorBody, CaseContext, CoverageAssessment, InvestigationResult } from "@/types/investigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 45000;

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
  } catch {}
  return `Request failed (${response.status}).`;
}

async function postWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("The AI took too long to respond. Please try again.");
    }
    throw new Error("Could not reach the server. Is the backend running?");
  } finally {
    clearTimeout(timeout);
  }
}

export interface InvestigateInput {
  description: string;
  policyFile: File | null;
  images: File[];
}

export async function investigate({ description, policyFile, images }: InvestigateInput): Promise<InvestigationResult> {
  const formData = new FormData();
  formData.append("description", description);
  if (policyFile) formData.append("policy_file", policyFile);
  for (const image of images) formData.append("images", image);

  const response = await postWithTimeout(`${API_BASE_URL}/api/investigate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(await parseErrorMessage(response));
  return (await response.json()) as InvestigationResult;
}

export interface FollowUpInput {
  context: CaseContext;
  priorAssessment: CoverageAssessment;
  answer: string;
  policyFile: File | null;
  images: File[];
}

export async function followUp({
  context,
  priorAssessment,
  answer,
  policyFile,
  images,
}: FollowUpInput): Promise<InvestigationResult> {
  const formData = new FormData();
  formData.append("context", JSON.stringify(context));
  formData.append("prior_assessment", JSON.stringify(priorAssessment));
  formData.append("answer", answer);
  if (policyFile) formData.append("policy_file", policyFile);
  for (const image of images) formData.append("images", image);

  const response = await postWithTimeout(`${API_BASE_URL}/api/follow-up`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(await parseErrorMessage(response));
  return (await response.json()) as InvestigationResult;
}
