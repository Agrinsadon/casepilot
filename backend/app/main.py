from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import cases

settings = get_settings()

app = FastAPI(title="CasePilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
