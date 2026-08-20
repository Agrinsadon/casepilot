import logging
from typing import Callable, TypeVar

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from openai import APIError, APITimeoutError, OpenAI, RateLimitError
from pydantic import ValidationError

from app.config import Settings, get_settings
from app.rate_limit import rate_limit
from app.schemas.analysis import CaseContext, CoverageAssessment, InvestigationResult
from app.services import case_analyzer, document_extraction
from app.services.document_extraction import IMAGE_CONTENT_TYPES, IMAGE_EXTENSIONS, UnsupportedFileError
from app.services.openai_client import get_openai_client

T = TypeVar("T")

logger = logging.getLogger("casepilot.cases")

router = APIRouter(prefix="/api", tags=["cases"], dependencies=[Depends(rate_limit)])


def _check_size(label: str, content: bytes, max_mb: float) -> None:
    size_mb = len(content) / (1024 * 1024)
    if size_mb > max_mb:
        raise HTTPException(
            status_code=400,
            detail=f"{label} is too large ({size_mb:.1f}MB). Maximum is {max_mb:.0f}MB.",
        )


def _require_client(settings: Settings) -> OpenAI:
    if not settings.openai_api_key:
        raise HTTPException(
            status_code=503,
            detail="The AI service isn't configured yet — OPENAI_API_KEY is missing on the backend.",
        )
    return get_openai_client()


def _is_image_upload(content_type: str, filename: str) -> bool:
    return content_type in IMAGE_CONTENT_TYPES or filename.lower().endswith(IMAGE_EXTENSIONS)


def _run_ai_step(label: str, fn: Callable[[], T]) -> T:
    try:
        return fn()
    except UnsupportedFileError:
        raise
    except APITimeoutError:
        raise HTTPException(status_code=504, detail=f"{label} took too long to respond. Please try again.")
    except RateLimitError:
        raise HTTPException(status_code=429, detail="The AI service is busy right now. Please try again shortly.")
    except APIError:
        logger.exception("%s failed", label)
        raise HTTPException(status_code=502, detail=f"{label} failed. Please try again.")
    except Exception:
        logger.exception("%s failed", label)
        raise HTTPException(status_code=502, detail=f"{label} failed. Please try again.")


async def _process_attachments(
    client: OpenAI,
    settings: Settings,
    policy_file: UploadFile | None,
    images: list[UploadFile],
) -> tuple[str | None, list[str], list[str]]:
    if len(images) > settings.max_images:
        raise HTTPException(
            status_code=400,
            detail=f"Too many photos — please attach at most {settings.max_images}.",
        )

    attachment_names: list[str] = []
    policy_text: str | None = None

    if policy_file is not None and policy_file.filename:
        raw = await policy_file.read()
        _check_size("Policy document", raw, settings.max_policy_mb)
        content_type = policy_file.content_type or "application/octet-stream"
        try:
            policy_text = _run_ai_step(
                "Reading your policy document",
                lambda: document_extraction.extract_policy_text(
                    client, settings.openai_model, raw, content_type, policy_file.filename or ""
                ),
            )
        except UnsupportedFileError as err:
            raise HTTPException(status_code=400, detail=str(err))
        attachment_names.append(policy_file.filename)

    image_summaries: list[str] = []
    for index, image in enumerate(images, start=1):
        if not image.filename:
            continue
        raw = await image.read()
        _check_size(f"Photo {index}", raw, settings.max_image_mb)
        content_type = image.content_type or "application/octet-stream"
        if not _is_image_upload(content_type, image.filename):
            raise HTTPException(status_code=400, detail=f"{image.filename} isn't a supported image type.")
        try:
            summary = _run_ai_step(
                f"Analyzing photo {index}",
                lambda content=raw, ct=content_type, fn=image.filename, i=index: document_extraction.describe_damage_photo(
                    client, settings.openai_model, content, ct, fn, i
                ),
            )
        except UnsupportedFileError as err:
            raise HTTPException(status_code=400, detail=str(err))
        image_summaries.append(summary)
        attachment_names.append(image.filename)

    return policy_text, image_summaries, attachment_names


@router.post("/investigate", response_model=InvestigationResult)
async def investigate(
    description: str = Form(..., min_length=1, max_length=4000),
    policy_file: UploadFile | None = File(None),
    images: list[UploadFile] = File(default=[]),
) -> InvestigationResult:
    description = description.strip()
    if not description:
        raise HTTPException(status_code=400, detail="Please describe what happened.")

    settings = get_settings()
    client = _require_client(settings)

    policy_text, image_summaries, attachment_names = await _process_attachments(
        client, settings, policy_file, images
    )

    context = CaseContext(
        description=description,
        policy_text=policy_text,
        image_summaries=image_summaries,
        attachment_names=attachment_names,
    )

    assessment = _run_ai_step(
        "The AI investigation",
        lambda: case_analyzer.run_investigation(client, settings.openai_model, context),
    )

    return InvestigationResult(assessment=assessment, context=context)


@router.post("/follow-up", response_model=InvestigationResult)
async def follow_up(
    context: str = Form(...),
    prior_assessment: str = Form(...),
    answer: str = Form(..., min_length=1, max_length=4000),
    policy_file: UploadFile | None = File(None),
    images: list[UploadFile] = File(default=[]),
) -> InvestigationResult:
    answer = answer.strip()
    if not answer:
        raise HTTPException(status_code=400, detail="Please write an answer.")

    try:
        parsed_context = CaseContext.model_validate_json(context)
        parsed_prior = CoverageAssessment.model_validate_json(prior_assessment)
    except ValidationError:
        raise HTTPException(status_code=400, detail="Could not read the case context. Please start a new case.")

    settings = get_settings()
    client = _require_client(settings)

    new_policy_text, new_image_summaries, new_attachment_names = await _process_attachments(
        client, settings, policy_file, images
    )

    merged_context = CaseContext(
        description=parsed_context.description,
        policy_text=new_policy_text or parsed_context.policy_text,
        image_summaries=parsed_context.image_summaries + new_image_summaries,
        attachment_names=parsed_context.attachment_names + new_attachment_names,
        conversation=parsed_context.conversation,
    )

    assessment, updated_context = _run_ai_step(
        "The AI reassessment",
        lambda: case_analyzer.run_follow_up(client, settings.openai_model, merged_context, parsed_prior, answer),
    )

    return InvestigationResult(assessment=assessment, context=updated_context)
