import base64
from io import BytesIO

from openai import OpenAI
from pypdf import PdfReader

IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"}
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif")
HEIC_CONTENT_TYPES = {"image/heic", "image/heif"}
HEIC_EXTENSIONS = (".heic", ".heif")


class UnsupportedFileError(Exception):
    pass


def _to_data_url(content: bytes, content_type: str) -> str:
    encoded = base64.b64encode(content).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def _is_image(content_type: str, filename: str) -> bool:
    return content_type in IMAGE_CONTENT_TYPES or filename.lower().endswith(IMAGE_EXTENSIONS)


def _is_heic(content_type: str, filename: str) -> bool:
    return content_type in HEIC_CONTENT_TYPES or filename.lower().endswith(HEIC_EXTENSIONS)


def _convert_heic_to_jpeg(content: bytes) -> bytes:
    import pillow_heif
    from PIL import Image, UnidentifiedImageError

    pillow_heif.register_heif_opener()
    try:
        image = Image.open(BytesIO(content)).convert("RGB")
    except UnidentifiedImageError:
        raise UnsupportedFileError("Could not read that HEIC photo. Try exporting it as JPEG first.")

    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=90)
    return buffer.getvalue()


def _prepare_for_vision(content: bytes, content_type: str, filename: str) -> tuple[bytes, str]:
    if _is_heic(content_type, filename):
        return _convert_heic_to_jpeg(content), "image/jpeg"
    return content, content_type


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n\n".join(page.strip() for page in pages if page.strip())


def describe_policy_image(client: OpenAI, model: str, content: bytes, content_type: str, filename: str = "") -> str:
    content, content_type = _prepare_for_vision(content, content_type, filename)
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


def describe_damage_photo(
    client: OpenAI, model: str, content: bytes, content_type: str, filename: str, index: int
) -> str:
    content, content_type = _prepare_for_vision(content, content_type, filename)
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
        return describe_policy_image(client, model, content, content_type, filename)

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
