import base64
from io import BytesIO

from openai import OpenAI
from pypdf import PdfReader

IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif")


class UnsupportedFileError(Exception):
    pass


def _to_data_url(content: bytes, content_type: str) -> str:
    encoded = base64.b64encode(content).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def _is_image(content_type: str, filename: str) -> bool:
    return content_type in IMAGE_CONTENT_TYPES or filename.lower().endswith(IMAGE_EXTENSIONS)


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n\n".join(page.strip() for page in pages if page.strip())


def describe_policy_image(client: OpenAI, model: str, content: bytes, content_type: str) -> str:
    data_url = _to_data_url(content, content_type)
    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Transcribe the readable text from this insurance policy document photo. "
                            "Focus on coverage terms, exclusions, conditions, and limits. "
                            "Return plain text only, no commentary."
                        ),
                    },
                    {"type": "input_image", "image_url": data_url, "detail": "high"},
                ],
            }
        ],
    )
    return response.output_text.strip()


def describe_damage_photo(client: OpenAI, model: str, content: bytes, content_type: str, index: int) -> str:
    data_url = _to_data_url(content, content_type)
    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Describe what this photo shows for an insurance damage claim. "
                            "Be factual and specific about visible damage, likely cause if apparent, "
                            "and severity. Do not speculate about coverage. Two to three sentences."
                        ),
                    },
                    {"type": "input_image", "image_url": data_url, "detail": "high"},
                ],
            }
        ],
    )
    return f"Photo {index}: {response.output_text.strip()}"


def extract_policy_text(client: OpenAI, model: str, content: bytes, content_type: str, filename: str) -> str:
    if not content:
        raise UnsupportedFileError("That file is empty.")

    if _is_image(content_type, filename):
        return describe_policy_image(client, model, content, content_type)

    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        text = extract_pdf_text(content)
        if not text:
            raise UnsupportedFileError("Could not find any readable text in that PDF.")
        return text

    try:
        text = content.decode("utf-8").strip()
    except UnicodeDecodeError:
        raise UnsupportedFileError("Unsupported file type. Please upload a PDF, image, or plain text document.")

    if not text:
        raise UnsupportedFileError("That file is empty.")
    return text
