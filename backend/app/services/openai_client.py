from functools import lru_cache

from openai import OpenAI

from app.config import get_settings


@lru_cache
def get_openai_client() -> OpenAI:
    return OpenAI(api_key=get_settings().openai_api_key, timeout=45.0, max_retries=2)
