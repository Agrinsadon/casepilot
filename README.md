# CasePilot

**AI agents for complex casework.**

Organizations rarely make important decisions from one clean input. A real case — an insurance claim, a loan application, a compliance review — needs documents, business rules, history, and human judgment before it can be resolved.

CasePilot is an interactive demo of an AI agent that investigates a case, decides whether it knows enough to make a recommendation, and asks for exactly what's missing when it doesn't. The demo domain is insurance, but the underlying idea is general-purpose casework automation:

> How can AI agents help with complex casework without turning the LLM into the business process itself?

## Two ways to see it

**Run the Case** is a scripted three-minute walkthrough of one fixed claim. A customer reports water damage. The agent reads the case, verifies the customer, retrieves the relevant policy section, and checks past claims. Its confidence comes out at 78% — below the 85% threshold required to act automatically — because one fact is missing. Instead of guessing, it proposes a next action, a human approves it, new information arrives, confidence rises to 94%, and the agent produces a recommendation with cited sources and a full decision trace.

**Try CasePilot** is the same journey, but real. You describe your own situation, optionally attach photos and a policy document, and a live OpenAI-backed agent investigates *your* case — reads your description, extracts your policy's actual terms from whatever you uploaded, looks at your photos, and produces a genuine confidence score, cited evidence, and either a recommendation or a specific follow-up question. If it needs more, you answer directly and it re-assesses, for as many rounds as it actually needs.

## Design principles

- **AI investigates and proposes; software enforces the workflow.** The model never executes an action directly — it returns a structured, validated proposal, and the backend checks it against deterministic rules before anything is shown as final.
- **Uncertainty is a feature, not a bug.** Confidence reflects evidence completeness, not a claimed probability from the model, and a low score blocks automatic approval regardless of what the model recommends.
- **Every claim needs a source.** Evidence traces back to something actually provided — the customer's own words, an extracted policy clause, or a specific photo — never an invented fact.
- **Humans stay in the loop where it matters.** In the scripted demo, approval is required before external communication. In the live flow, the agent asks the person directly instead of guessing.

## How the agent reasons

Each investigation is one structured-output call to OpenAI's Responses API, constrained to a Pydantic schema — the model can't return free text, only a validated object: coverage status, a confidence score, sourced evidence, missing-information questions, and a recommendation.

The prompt tells the agent a confidence below 85 must not produce "approve" and must include at least one specific question — but the backend re-checks this after every response and corrects it if the model doesn't comply, rather than trusting it to follow instructions perfectly. It also caps confidence at 60 whenever no policy document has been provided, regardless of what the model returns — coverage genuinely can't be confirmed without seeing the actual policy, so that ceiling is enforced in code, not requested in the prompt. Both checks run in plain code, not another model call.

Images — damage photos or a photographed policy page — are described through the same model's vision input before the reasoning step runs; PDF policy documents are parsed for text directly. In testing, when a user described a photo in words without actually uploading it, the agent asked for the real file instead of taking the description at face value — it only treats evidence as evidence if it was actually given the file.

## The interactive follow-up loop

The backend is stateless for this feature — no session, no database. After each call, the API hands back an opaque context bundle (the description, extracted policy text, photo descriptions, and the full question/answer history so far) alongside the assessment. The frontend holds onto it and sends it back with the next answer, so the agent keeps reasoning about the same case across multiple rounds without the server remembering anything between requests, and never asks the customer to repeat something they've already answered. You can also attach a file — the policy document you skipped the first time, a photo — directly on a follow-up round, not just the initial submission. If an answer resolves the open question, confidence rises and the case moves to a recommendation; if it doesn't, the agent asks again, up to four rounds, after which it settles on its best honest assessment rather than looping forever.

## Failure handling

- Unsupported or empty files are rejected with a specific message before they reach the model.
- OpenAI timeouts, rate limits, and API errors map to distinct responses (504, 429, 502) instead of a generic failure.
- A per-IP rate limiter protects against runaway API cost.
- Requests time out client-side after 45 seconds so a hung call can't leave the UI stuck indefinitely.
- Progress survives a page refresh, with any in-flight state reset cleanly on restore instead of frozen mid-animation.

## Architecture

```
Next.js (UI)
      │
      ▼
FastAPI
      │
      ▼
Extract policy text and photo descriptions (pypdf / vision)
      │
      ▼
OpenAI Responses API — structured coverage assessment
      │
      ▼
Deterministic policy check
      │
      ▼
Coverage assessment (JSON) → back to the UI
```

PostgreSQL + pgvector is provisioned (`docker-compose.yml`) for a future phase — a persisted, resumable case orchestrator with an audit log — but the current AI feature is intentionally stateless.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, TypeScript, CSS Modules |
| Backend | FastAPI, Python, Pydantic |
| AI | OpenAI Responses API, structured (Pydantic) outputs, vision |
| Database | PostgreSQL + pgvector — provisioned, not yet wired into the API |

## Project structure

```
frontend/   Next.js app — scripted demo, Try CasePilot flow, shared UI
backend/    FastAPI app — file extraction, agent reasoning, API
docker-compose.yml   PostgreSQL + pgvector for local development
casepilot.md         Full product and design brief
```

## Running locally

**Backend**

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
# set OPENAI_API_KEY in backend/.env
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the app: click **Run the Case** for the scripted demo, or **Try CasePilot** to submit your own claim against the live agent. The frontend talks to the backend at `http://localhost:8000` by default — set `NEXT_PUBLIC_API_BASE_URL` to override.

## Status

- **Run the Case** — the scripted demo — is complete: full UI journey, decision trace, source citations.
- **Try CasePilot** — the real AI-backed investigation — is live: file upload, vision and PDF extraction, structured reasoning, deterministic policy enforcement, and a multi-round interactive follow-up loop, tested against real failure cases.
- Not yet built: a persisted case orchestrator, audit log, and policy retrieval over a document database. See [casepilot.md](casepilot.md) for the full target architecture and build plan.
