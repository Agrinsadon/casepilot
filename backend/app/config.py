from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    openai_api_key: str
    openai_model: str = "gpt-5.4-mini"

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3411",
        "http://localhost:3412",
    ]

    max_images: int = 4
    max_image_mb: float = 8.0
    max_policy_mb: float = 12.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
