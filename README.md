# CasePilot

**AI agents for complex casework.**

Organizations rarely make important decisions from one clean input. A real case — an insurance claim, a loan application, a compliance review — needs documents, business rules, history, and human judgment before it can be resolved.

CasePilot is an interactive demo of an AI agent that investigates a case, decides whether it knows enough to make a recommendation, and asks for exactly what's missing when it doesn't. The demo domain is insurance, but the underlying idea is general-purpose casework automation:

> How can AI agents help with complex casework without turning the LLM into the business process itself?

## The story

A customer reports water damage. The agent reads the case, verifies the customer, retrieves the relevant policy section, and checks past claims. Its confidence in a coverage decision comes out at 78% — below the 85% threshold required to act automatically — because one fact (when the leak started) is missing.

Instead of guessing, the agent proposes a next action: request that detail from the repair company. A human reviews and approves the message. Once the response arrives, the case resumes automatically, confidence rises to 94%, and the agent produces a final recommendation with cited sources and a full decision trace.

The whole run takes about three minutes. See [casepilot.md](casepilot.md) for the full product brief and scene-by-scene design.

## Design principles

- **AI investigates and proposes; software enforces the workflow.** The LLM never executes business actions directly — it produces structured, validated proposals that pass through deterministic policy checks.
- **Uncertainty is a feature, not a bug.** Confidence is a transparent, application-level score based on evidence completeness, not a claimed probability from the model.
- **Every claim needs a source.** Recommendations cite the document, page, and passage that support them.
- **Humans stay in the loop where it matters.** Approval is required before external communication or financial actions — not sprinkled everywhere.
- **The process is resumable and auditable.** Case state persists through a state machine, and every step emits an event to an audit log.

## Architecture

```
Next.js (UI) → FastAPI (API) → Case Orchestrator
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                 │
              Agent Planner     Tool Registry      Policy Engine
                     │                │                 │
                     │         Document Retrieval        │
                     └────────────────┼────────────────┘
                                      │
                              PostgreSQL + pgvector
                                      │
                                  Audit Log
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, TypeScript, Framer Motion |
| Backend | FastAPI, Python, Pydantic, SQLAlchemy |
| Database | PostgreSQL + pgvector (for policy retrieval) |
| AI | OpenAI API, structured (Pydantic-typed) outputs |

## Project structure

```
frontend/   Next.js app — case UI, investigation timeline, decision trace
backend/    FastAPI app — case orchestrator, agent tools, retrieval, API
docker-compose.yml   PostgreSQL + pgvector for local development
casepilot.md         Full product and design brief
```

## Running locally

**Database**

```bash
docker compose up -d
```

**Backend**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# add OPENAI_API_KEY and database settings to backend/.env
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Then open the app and click **Run the case**.

## Status

CasePilot is an active portfolio project, built in phases: static UI journey → API-backed case state → document retrieval and citations → LLM-driven agent tools → resumable workflow → tests and hardening. See [casepilot.md](casepilot.md) for the full build plan.
