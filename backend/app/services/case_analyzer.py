from openai import OpenAI

from app.schemas.analysis import CaseContext, ConversationTurn, CoverageAssessment, MissingInformationItem

AUTO_RECOMMEND_THRESHOLD = 85
NO_POLICY_CONFIDENCE_CEILING = 60

NEED_POLICY_QUESTION = MissingInformationItem(
    question="Can you share your policy document or the relevant coverage terms?",
    reason="Coverage cannot be confirmed without seeing your actual policy.",
)

AGENT_INSTRUCTIONS = """You are the CasePilot claims investigation agent.

You review a customer's own claim description, an optional policy document, and \
optional damage photos, then produce a structured coverage assessment.

Rules you must follow:
- Never invent facts that are not present in the description, policy text, or photo \
descriptions. If something is unknown, list it under missing_information instead of \
guessing.
- Every item in `evidence` must be traceable to something actually provided (the \
customer's description, the policy text, or a specific photo). Reference the source \
plainly, e.g. "your policy document", "photo 1", "your description".
- If no policy document was provided, you cannot confirm coverage terms. Say so, keep \
`covered` as "uncertain", and include a missing_information item asking for the policy.
- Confidence is an application-level completeness score from 0-100, not a claim of \
certainty. Base it on: how clearly the incident is described, whether a relevant policy \
clause was found, whether photo evidence supports the description, and whether any \
critical fact is missing. A confidence of 85 or higher requires that no critical \
information is missing and a relevant policy clause was found.
- If confidence is below 85 or critical information is missing, `recommendation` must be \
"request_information" (never "approve"), and `missing_information` must contain at least \
one specific, answerable question.
- Only use "deny" when the policy text or description clearly rules out coverage. Only use \
"escalate_to_human" for situations involving potential fraud, large/unclear sums, or \
ambiguity a claims handler should judge personally.
- estimated_compensation should be null unless the description or policy gives enough basis \
to give a rough figure — never fabricate a specific amount.
- If a conversation history is included, treat it as already-confirmed context. Do not ask \
the customer to repeat something they already answered.
- Keep prose concise and factual. This is a professional claims tool, not a chatbot."""

FOLLOW_UP_INSTRUCTIONS = (
    AGENT_INSTRUCTIONS
    + "\n\nThe customer has just answered your most recent question(s). Re-assess the case with "
    "this new information. If it resolves the gap, raise confidence accordingly and move toward "
    "a recommendation. If it does not fully resolve the gap, keep asking only for what is still "
    "missing."
)


def _enforce_policy(assessment: CoverageAssessment, context: CaseContext) -> CoverageAssessment:
    has_policy = bool(context.policy_text)

    if not has_policy and assessment.confidence > NO_POLICY_CONFIDENCE_CEILING:
        assessment.confidence = NO_POLICY_CONFIDENCE_CEILING

    if assessment.confidence < AUTO_RECOMMEND_THRESHOLD and assessment.recommendation == "approve":
        assessment.recommendation = "request_information"

    if not has_policy and not any("polic" in item.question.lower() for item in assessment.missing_information):
        assessment.missing_information.append(NEED_POLICY_QUESTION)

    if assessment.recommendation == "request_information" and not assessment.missing_information:
        assessment.missing_information.append(
            MissingInformationItem(
                question="Can you share any additional details or documents that support this claim?",
                reason="The assessment is below the confidence threshold required to proceed automatically.",
            )
        )

    return assessment


def _context_input(context: CaseContext) -> str:
    parts = [f"CUSTOMER'S DESCRIPTION:\n{context.description.strip()}"]

    if context.policy_text:
        parts.append(f"POLICY DOCUMENT (extracted text):\n{context.policy_text.strip()}")
    else:
        parts.append("POLICY DOCUMENT: none provided.")

    if context.image_summaries:
        parts.append("DAMAGE PHOTOS:\n" + "\n".join(context.image_summaries))
    else:
        parts.append("DAMAGE PHOTOS: none provided.")

    if context.conversation:
        history_lines = []
        for turn in context.conversation:
            for question in turn.questions:
                history_lines.append(f"Q: {question}")
            history_lines.append(f'A: "{turn.answer}"')
        parts.append("CONVERSATION SO FAR:\n" + "\n".join(history_lines))

    return "\n\n".join(parts)


def run_investigation(client: OpenAI, model: str, context: CaseContext) -> CoverageAssessment:
    response = client.responses.parse(
        model=model,
        instructions=AGENT_INSTRUCTIONS,
        input=_context_input(context),
        text_format=CoverageAssessment,
    )
    assessment = response.output_parsed
    if assessment is None:
        raise RuntimeError("The model did not return a parsable assessment.")
    return _enforce_policy(assessment, context)


def run_follow_up(
    client: OpenAI,
    model: str,
    context: CaseContext,
    prior_assessment: CoverageAssessment,
    answer: str,
) -> tuple[CoverageAssessment, CaseContext]:
    turn = ConversationTurn(
        questions=[item.question for item in prior_assessment.missing_information],
        answer=answer.strip(),
    )
    updated_context = context.model_copy(update={"conversation": [*context.conversation, turn]})

    response = client.responses.parse(
        model=model,
        instructions=FOLLOW_UP_INSTRUCTIONS,
        input=_context_input(updated_context),
        text_format=CoverageAssessment,
    )
    assessment = response.output_parsed
    if assessment is None:
        raise RuntimeError("The model did not return a parsable assessment.")
    return _enforce_policy(assessment, updated_context), updated_context
