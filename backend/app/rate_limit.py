import time
from collections import defaultdict

from fastapi import HTTPException, Request

WINDOW_SECONDS = 60
MAX_REQUESTS_PER_WINDOW = 10

_requests: dict[str, list[float]] = defaultdict(list)


def rate_limit(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    timestamps = _requests[client_ip]
    timestamps[:] = [t for t in timestamps if now - t < WINDOW_SECONDS]

    if len(timestamps) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a moment and try again.")

    timestamps.append(now)
