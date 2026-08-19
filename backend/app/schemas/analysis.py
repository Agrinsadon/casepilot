from typing import Literal

from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    label: str = Field(description="Short name of the fact this evidence supports, e.g. 'Covered damage type'.")
    detail: str = Field(description="The specific fact or excerpt that supports it.")
    source: str = Field(description="Where this came from, e.g. 'your policy document', 'photo 1', 'your description'.")


class MissingInformationItem(BaseModel):
    question: str = Field(description="A single, specific question to ask the customer to resolve the gap.")
    reason: str = Field(description="Why this is required to reach a confident decision.")


class CoverageAssessment(BaseModel):
    incident_type: str = Field(description="Short label for the type of incident, e.g. 'Water damage'.")
    summary: str = Field(description="One or two plain-English sentences summarizing the case so far.")
    covered: Literal["likely", "unlikely", "uncertain"]
    confidence: int = Field(ge=0, le=100, description="Application-level confidence score, 0-100.")
    reasoning: str = Field(description="Brief explanation connecting the evidence to the coverage conclusion.")
    evidence: list[EvidenceItem] = Field(default_factory=list)
    missing_information: list[MissingInformationItem] = Field(default_factory=list)
    estimated_compensation: str | None = Field(
        default=None, description="Rough estimated compensation as a string, e.g. '€3,850', or null if unknown."
    )
    recommendation: Literal["approve", "request_information", "deny", "escalate_to_human"]
    next_action: str = Field(description="One sentence describing what happens next.")


class ConversationTurn(BaseModel):
    questions: list[str]
    answer: str


class CaseContext(BaseModel):
    description: str
    policy_text: str | None = None
    image_summaries: list[str] = Field(default_factory=list)
    attachment_names: list[str] = Field(default_factory=list)
    conversation: list[ConversationTurn] = Field(default_factory=list)


class InvestigationResult(BaseModel):
    assessment: CoverageAssessment
    context: CaseContext
