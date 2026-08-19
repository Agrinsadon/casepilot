r# CasePilot

## Claude Project Brief

Build **CasePilot** as a polished portfolio project for a software
development and AI consulting role.

This is not a generic chatbot.

This is not an insurance classifier.

This is not a collection of AI buttons.

CasePilot is an interactive demonstration of how an AI agent can work
through a complex business case while remaining explainable controlled
and useful to a human expert.

The demo domain is insurance claims but the product concept must feel
reusable across industries.

The experience should make a recruiter think:

> He did not just connect an LLM to a frontend. He understood the
> business problem and designed an AI assisted workflow around it.

The core idea the visitor should remember is:

> **The agent knows when it does not know enough to make a decision.**

------------------------------------------------------------------------

# 1. The story

A customer reports water damage in her apartment.

The case contains multiple documents and pieces of evidence.

The AI agent must investigate the case.

It must identify the customer.

It must understand what happened.

It must inspect the insurance policy.

It must compare the damage against the policy.

It must search previous claims.

It must identify missing information.

It must decide whether there is enough evidence to make a
recommendation.

If confidence is too low it must not pretend to know the answer.

Instead it must determine what information is missing.

It then prepares the next action for a human to review.

The human approves that action.

New information arrives.

The agent automatically resumes the case.

Its confidence changes because the evidence changed.

Finally it produces a recommendation with sources and a complete
decision trace.

The entire experience should take approximately three to four minutes.

------------------------------------------------------------------------

# 2. Product positioning

## Name

**CasePilot**

## Tagline

**AI agents for complex casework.**

## Demo message

**One case. Six documents. Three systems. One decision.**

## Core principle

AI can investigate.

AI can propose.

Software enforces the workflow.

Humans remain accountable.

------------------------------------------------------------------------

# 3. Why this project exists

Many organizations have work that is not a simple question and answer
problem.

A real business case may require information from documents databases
policies previous cases external parties and human experts.

The difficult part is not generating text.

The difficult part is deciding:

What information matters?

What should happen next?

What evidence supports the conclusion?

Is important information missing?

How confident is the system?

When should a human become involved?

Can the result be audited afterwards?

CasePilot should demonstrate an answer to those questions.

------------------------------------------------------------------------

# 4. The recruiter journey

The visitor should experience one continuous story.

Do not overwhelm the visitor with dashboards.

Do not begin with architecture.

Do not explain every AI concept before the demo starts.

Let the visitor discover the system by using it.

The main journey is:

``` text
CASE ARRIVES

      ↓

RUN INVESTIGATION

      ↓

AGENT CREATES A PLAN

      ↓

AGENT READS THE CASE

      ↓

AGENT FINDS RELEVANT POLICY

      ↓

78% CONFIDENCE

      ↓

MISSING INFORMATION DETECTED

      ↓

AGENT PREPARES NEXT ACTION

      ↓

HUMAN APPROVES

      ↓

NEW INFORMATION ARRIVES

      ↓

AGENT RESUMES

      ↓

78% → 94%

      ↓

RECOMMENDATION CREATED

      ↓

WHY THIS DECISION?

      ↓

FULL DECISION TRACE
```

------------------------------------------------------------------------

# 5. Landing page

Keep the landing page short.

It is an introduction to the experience rather than a marketing website.

## Hero

Use a strong editorial visual hierarchy.

Suggested copy:

# One case.

# Six documents.

# Three systems.

# One decision.

Supporting text:

**See how an AI agent investigates a complex case without pretending to
know what it does not know.**

Primary CTA:

**RUN THE CASE →**

Secondary small text:

**Interactive demo · approximately 3 minutes**

The CTA should transition beautifully into the application.

A short cinematic transition is welcome.

Do not create a long landing page.

------------------------------------------------------------------------

# 6. Scene One --- Case arrives

The user enters the application.

The interface should feel like a real professional case management
product.

Show:

``` text
CASE #2026-1842

Water damage

Laura Virtanen

Received
18 Aug 2026 · 14:32
```

Customer message:

> Yesterday I noticed water coming through the kitchen ceiling.
>
> The upstairs apartment apparently had a dishwasher leak.
>
> I have attached photos and the repair company's initial report.

Show six case items:

``` text
customer-message.pdf
policy.pdf
damage-photo-01.jpg
damage-photo-02.jpg
repair-report.pdf
previous-claim.pdf
```

Primary action:

**INVESTIGATE CASE →**

The page should not explain what the AI is going to do in a long
paragraph.

The user should want to press the button.

------------------------------------------------------------------------

# 7. Scene Two --- Agent plan

After the visitor starts the investigation the agent creates a visible
plan.

Example:

``` text
AGENT PLAN

01  Identify customer
02  Read damage report
03  Inspect policy
04  Search previous claims
05  Determine coverage
06  Identify missing evidence
07  Recommend next action
```

The plan should feel generated for this particular case.

Primary action:

**EXECUTE PLAN →**

The purpose of this screen is to communicate that the system is planning
work rather than sending one giant prompt to an LLM.

------------------------------------------------------------------------

# 8. Scene Three --- Investigation

This should be one of the strongest screens in the project.

The visitor watches the agent work.

Steps appear sequentially.

Example:

``` text
Customer lookup

Laura Virtanen

✓ Identity verified
```

Then:

``` text
Document analysis

6 documents processed

✓ Complete
```

Then:

``` text
Policy search

Query

"water damage dishwasher leak"

Relevant section found

Home Insurance §4.2
Water damage coverage
```

Then:

``` text
Previous claims

1 previous claim

2023 · Storm damage

No relationship detected
```

Then:

``` text
Damage assessment

Cause
Dishwasher leak

Estimated damage
€4,200

Coverage
Likely covered
```

The animation should communicate progress without becoming theatrical or
slow.

The recruiter should understand what tools are being used.

------------------------------------------------------------------------

# 9. Scene Four --- Uncertainty

The investigation should not end with a convenient perfect answer.

The agent discovers missing information.

Display a clear interruption:

``` text
MISSING INFORMATION
```

Then:

``` text
The repair report confirms water damage.

However the report does not confirm when the dishwasher leak began.
```

Show confidence:

``` text
Coverage confidence

78%
```

Show the business threshold:

``` text
Automatic recommendation threshold

85%
```

Then:

``` text
AUTOMATIC DECISION

NOT ALLOWED
```

This is an important part of the story.

The system is valuable because it recognizes uncertainty.

Do not make the LLM invent the missing fact.

------------------------------------------------------------------------

# 10. Scene Five --- Agent determines the next action

The agent should not simply stop with:

**Human required.**

It should reason about what would resolve the uncertainty.

Display:

``` text
WHAT WOULD RESOLVE THIS CASE?

Leak start time

Confirmation from repair company
```

Then:

``` text
NEXT ACTION

Request additional information from repair company
```

Primary action:

**REVIEW REQUEST →**

This demonstrates that the agent can move a business process forward
even when it cannot complete the final decision.

------------------------------------------------------------------------

# 11. Scene Six --- Human review

Show the communication prepared by the agent.

Example:

``` text
To
Nordic Repair Oy

Subject
Additional information required
Case #2026-1842
```

Message:

> Hello
>
> We are reviewing the water damage reported by Laura Virtanen.
>
> Could you confirm the estimated time at which the dishwasher leak
> began?
>
> This information is required to complete the coverage assessment.

Show a clear status:

``` text
AI CREATED

HUMAN APPROVAL REQUIRED
```

Actions:

**EDIT**

**APPROVE & SEND**

The demo must not actually send external email.

The send action is simulated.

This is intentional.

The project demonstrates the workflow without requiring live external
communication.

------------------------------------------------------------------------

# 12. Scene Seven --- New information

After approval simulate time passing briefly.

Then show:

``` text
NEW INFORMATION RECEIVED
```

From:

``` text
Nordic Repair Oy
```

Message:

> The leak appears to have started approximately two hours before it was
> discovered.

Then:

``` text
CASE UPDATED

Re evaluating coverage...
```

The important interaction is that the agent resumes automatically
because the case state changed.

The user should not need to restart the entire workflow.

------------------------------------------------------------------------

# 13. Scene Eight --- Confidence changes

This is the visual payoff.

Show the previous state:

``` text
BEFORE

Coverage confidence

78%

Missing evidence
```

Then transition to:

``` text
AFTER

Coverage confidence

94%

Coverage supported
```

The UI should make the reason for the change obvious.

Add:

``` text
NEW EVIDENCE

Leak duration confirmed
```

The message is:

The model did not randomly become more confident.

The evidence changed.

------------------------------------------------------------------------

# 14. Scene Nine --- Recommendation

Now show the final recommendation.

Example:

``` text
RECOMMENDATION

APPROVE CLAIM
```

Then:

``` text
Estimated compensation

€3,850
```

Evidence:

``` text
✓ Active policy

✓ Covered damage type

✓ Repair report

✓ Leak duration confirmed

✓ Customer identity verified
```

Confidence:

``` text
94%
```

Do not present the recommendation as magical AI output.

Every important claim must have supporting evidence.

------------------------------------------------------------------------

# 15. Source citations

Evidence should be clickable.

Examples:

``` text
Covered damage type
policy.pdf · page 14

Damage estimate
repair-report.pdf · page 3

Leak duration
repair-company-response
```

Clicking a source should open a side panel or document preview.

Highlight the relevant passage.

This is one of the most important product details.

The visitor should be able to move from:

**AI says this**

to:

**Here is why**

within one click.

------------------------------------------------------------------------

# 16. Why this decision

Add a prominent button:

**WHY THIS DECISION?**

This opens the decision trace.

Example:

``` text
Customer message

        ↓

Water damage detected

        ↓

Policy §4.2 retrieved

        ↓

Coverage conditions checked

        ↓

Missing leak duration detected

        ↓

Additional information requested

        ↓

Repair company response received

        ↓

Coverage confidence

78% → 94%

        ↓

Recommendation

APPROVE
```

This should be visual and easy to understand.

Do not display raw chain of thought.

The decision trace represents observable system events evidence tool
calls business rules and structured outputs.

------------------------------------------------------------------------

# 17. Final screen

End with a concise message.

Suggested headline:

# AI should not just answer.

# It should know what happens next.

Supporting line:

**CasePilot combines AI reasoning business rules evidence and human
review into one auditable workflow.**

Actions:

**RUN AGAIN**

**VIEW ARCHITECTURE**

**GITHUB**

The architecture should be optional.

Do not force technical detail into the main story.

------------------------------------------------------------------------

# 18. Domain strategy

The demo uses insurance because insurance naturally contains documents
rules uncertainty decisions and human review.

But CasePilot should not be presented as only an insurance product.

The underlying concept is:

**AI assisted complex casework.**

Possible future domains:

``` text
Insurance claims

Public sector applications

Customer complaints

Loan applications

Procurement cases

Compliance reviews

Internal service requests
```

The code should make the demo domain reasonably replaceable.

Do not over engineer a full multi tenant platform.

The portfolio project only needs one excellent insurance journey.

------------------------------------------------------------------------

# 19. Technical architecture

Recommended stack:

``` text
Next.js
TypeScript
React
CSS Modules or Tailwind
Framer Motion

FastAPI
Python
Pydantic

PostgreSQL

OpenAI API

Vector search
pgvector or another simple vector store
```

Conceptual architecture:

``` text
                ┌───────────────────┐
                │      Next.js      │
                │   CasePilot UI    │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │      FastAPI      │
                │    Application    │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Case Orchestrator │
                └─────────┬─────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
    Agent Planner    Tool Registry    Policy Engine
          │               │                │
          │               ▼                │
          │        Business Services       │
          │               │                │
          └───────────────┼────────────────┘
                          │
                          ▼
                 Document Retrieval
                          │
                          ▼
                    PostgreSQL
                          │
                          ▼
                     Audit Log
```

------------------------------------------------------------------------

# 20. Case orchestrator

Do not implement the application as a single LLM call.

Create a small orchestration layer.

Example responsibilities:

``` text
load current case state

determine next workflow step

call the required tool

validate structured output

apply deterministic rules

store events

pause when human approval is required

resume when new information arrives
```

Possible case states:

``` text
RECEIVED

PLANNING

INVESTIGATING

WAITING_FOR_INFORMATION

WAITING_FOR_APPROVAL

REASSESSING

READY_FOR_RECOMMENDATION

COMPLETED
```

This state machine will make the project much easier to reason about and
test.

------------------------------------------------------------------------

# 21. Agent tools

Create explicit tools.

Examples:

``` python
search_policy()

read_document()

get_customer()

get_previous_cases()

calculate_compensation()

identify_missing_information()

request_information()

create_customer_message()

recommend_decision()
```

The LLM should not receive direct unrestricted access to everything.

Each tool has a clear purpose.

Each tool should return structured data.

------------------------------------------------------------------------

# 22. Structured AI output

Use Pydantic models.

Example:

``` python
from pydantic import BaseModel


class Source(BaseModel):
    document_id: str
    page: int | None = None
    excerpt: str


class CoverageFinding(BaseModel):
    covered: bool | None
    confidence: float
    reason: str
    sources: list[Source]
    missing_information: list[str]
```

Another example:

``` python
class ProposedAction(BaseModel):
    action: str
    target: str | None
    reason: str
    confidence: float
    requires_human_approval: bool
```

Avoid parsing arbitrary prose when a typed object can be used.

------------------------------------------------------------------------

# 23. Action boundary

This is where the useful idea from AgentLab survives.

The AI does not directly execute important business actions.

It proposes them.

Example:

``` json
{
  "proposed_action": "request_information",
  "target": "repair_company",
  "reason": "Leak duration is unknown",
  "confidence": 0.78
}
```

Application code determines whether the action is allowed.

Example:

``` text
AI proposal
      ↓
Schema validation
      ↓
Policy check
      ↓
Human approval if required
      ↓
Execution
```

This separation is important.

The LLM reasons.

The application controls.

------------------------------------------------------------------------

# 24. Retrieval and RAG

The policy document should be searchable.

Split documents into chunks.

Store metadata such as:

``` text
document id
document name
page
section
chunk text
embedding
```

When the agent needs to determine coverage it should retrieve relevant
policy passages.

The final recommendation must reference those passages.

Do not use RAG simply so the README can say that the project uses RAG.

Make retrieval visible in the product.

The recruiter should see:

``` text
Searching policy...

Query
"water damage dishwasher leak"

1 relevant section found
```

Then allow the source to be opened.

------------------------------------------------------------------------

# 25. Confidence

Do not treat LLM confidence as scientifically calibrated probability.

For the demo define a transparent application level confidence model.

For example confidence can be influenced by:

``` text
required evidence present

customer identity verified

policy section retrieved

documents consistent

critical fields missing

conflicting information
```

The UI may display:

``` text
78%
```

But the README should explain that this is a demo decision score rather
than a guaranteed probability of correctness.

This is a better engineering story than asking an LLM:

**How confident are you from zero to one?**

------------------------------------------------------------------------

# 26. Deterministic policy rules

Important workflow rules should live outside the LLM.

Example:

``` python
AUTO_RECOMMEND_THRESHOLD = 0.85

if coverage.confidence < AUTO_RECOMMEND_THRESHOLD:
    case.status = "WAITING_FOR_INFORMATION"
```

Other possible rules:

``` text
external messages require approval

payments require approval

customer identity must be verified

recommendations require cited evidence

missing critical evidence blocks automatic completion
```

The recruiter should be able to understand which parts are probabilistic
and which parts are deterministic.

------------------------------------------------------------------------

# 27. Human in the loop

Human involvement should feel purposeful.

Do not add approval buttons everywhere.

Use human review when:

``` text
external communication is about to be sent

critical information is ambiguous

financial action would be executed

confidence is below the required threshold

policy rules explicitly require approval
```

In the main demo only one strong approval moment is enough.

------------------------------------------------------------------------

# 28. Audit log

Record important observable events.

Example:

``` text
case.created

agent.plan_created

tool.customer_lookup.started

tool.customer_lookup.completed

document.policy.retrieved

coverage.assessment.created

missing_information.detected

action.request_information.proposed

human.approval.requested

human.approval.received

external_response.received

coverage.reassessment.completed

recommendation.created
```

Each event can contain:

``` text
timestamp

case id

event type

actor

tool

structured input

structured result

source references
```

Do not store hidden model chain of thought.

Store system events and structured reasoning artifacts intended for
auditability.

------------------------------------------------------------------------

# 29. Demo data

Use synthetic data only.

Customer:

``` text
Laura Virtanen
```

Case:

``` text
CASE #2026-1842
```

Damage:

``` text
Water damage caused by dishwasher leak
```

Invoice or damage estimate:

``` text
€4,200
```

Recommended compensation:

``` text
€3,850
```

Initial confidence:

``` text
78%
```

Final confidence:

``` text
94%
```

Automatic recommendation threshold:

``` text
85%
```

Repair company:

``` text
Nordic Repair Oy
```

Create realistic synthetic documents.

Do not use real customer data.

------------------------------------------------------------------------

# 30. Document set

Create a small fixture dataset.

## customer-message.pdf

Contains the initial customer description.

## policy.pdf

Contains a fictional home insurance policy.

Include a relevant section around page 14:

``` text
§4.2 Water damage

Sudden and unexpected water damage caused by a household appliance may be covered when the insured has taken reasonable action to limit further damage.
```

## repair-report.pdf

Contains:

``` text
water damage confirmed

dishwasher identified as likely source

estimated repair cost €4,200

leak start time unknown
```

## previous-claim.pdf

Contains an unrelated 2023 storm damage claim.

## damage photos

Use synthetic demo images.

## repair company response

This appears later in the workflow.

------------------------------------------------------------------------

# 31. Backend endpoints

Possible API design:

``` text
GET /cases/{case_id}

POST /cases/{case_id}/investigate

GET /cases/{case_id}/events

GET /cases/{case_id}/plan

GET /cases/{case_id}/recommendation

POST /cases/{case_id}/actions/{action_id}/approve

POST /cases/{case_id}/simulate-response

GET /documents/{document_id}

GET /documents/{document_id}/sources
```

Keep the API small.

Do not build unnecessary CRUD screens.

------------------------------------------------------------------------

# 32. Frontend structure

Possible structure:

``` text
app/

  page.tsx

  case/
    [id]/
      page.tsx

components/

  CaseHeader.tsx
  CaseMessage.tsx
  AttachmentList.tsx
  AgentPlan.tsx
  InvestigationTimeline.tsx
  ToolExecution.tsx
  ConfidenceMeter.tsx
  MissingInformation.tsx
  ApprovalPanel.tsx
  SourceCitation.tsx
  DocumentViewer.tsx
  Recommendation.tsx
  DecisionTrace.tsx

lib/

  api.ts
  types.ts
```

Keep components focused.

------------------------------------------------------------------------

# 33. Visual direction

The design should feel like a modern consultancy prototype rather than a
generic SaaS dashboard.

Desired qualities:

``` text
editorial

confident

minimal

high contrast

large typography

clear hierarchy

subtle motion

professional

slightly experimental
```

Avoid:

``` text
purple AI gradients

glowing robot icons

chat bubbles everywhere

dozens of cards

huge sidebars

unnecessary charts

glassmorphism

generic dashboard templates
```

The case itself is the hero.

------------------------------------------------------------------------

# 34. Motion

Motion should communicate system state.

Use motion for:

``` text
case entering investigation

plan appearing step by step

tool execution

document retrieval

confidence changing

new information arriving

decision trace revealing
```

Do not animate everything.

The strongest animation should probably be:

``` text
78%

      ↓ new evidence

94%
```

The recruiter should immediately understand why the state changed.

------------------------------------------------------------------------

# 35. Error and uncertainty states

The demo should include realistic states.

Examples:

``` text
tool unavailable

document could not be parsed

no relevant policy section found

conflicting evidence

human rejected action

external information never arrived
```

You do not need to expose all of these in the primary recruiter journey.

But the architecture should support them.

------------------------------------------------------------------------

# 36. Testing strategy

Testing is part of the portfolio story.

## Unit tests

Test:

``` text
policy threshold logic

case state transitions

compensation calculation

structured output validation

source requirement

approval rules
```

## Agent tests

Use deterministic fixtures.

Example:

``` text
Given

policy coverage section exists

repair report confirms damage

leak duration missing

Then

system must not create final automatic recommendation

system must propose requesting missing information
```

Then:

``` text
Given

repair company confirms leak duration

Then

case is reassessed

confidence passes threshold

recommendation can be produced
```

## API tests

Test important FastAPI routes.

## Frontend tests

Test the critical recruiter journey.

------------------------------------------------------------------------

# 37. Security story

The project does not need enterprise security infrastructure.

But it should demonstrate correct thinking.

Explain:

``` text
LLM cannot directly execute arbitrary tools

tool inputs are validated

actions are permission checked

external communication requires approval

documents are scoped to the current case

audit events are immutable in the demo architecture

secrets live in environment variables

synthetic data is used in the public demo
```

------------------------------------------------------------------------

# 38. Observability

Show that agent systems need more than application logs.

Track:

``` text
case execution time

tool calls

tool failures

retrieval results

model calls

token usage

workflow state transitions

human approval wait time
```

A simple developer view is enough.

Do not put observability dashboards in the main recruiter flow.

------------------------------------------------------------------------

# 39. Cost control

The public demo should not make unnecessary model calls.

Prefer:

``` text
preloaded synthetic case

cached document embeddings

small structured prompts

limited tool loop

maximum agent steps

server side rate limiting
```

For a portfolio deployment consider a demo mode that can replay a known
execution when API limits are reached.

The experience should never break simply because someone opened the
portfolio.

------------------------------------------------------------------------

# 40. README narrative

The README should explain the project as a business problem first.

Suggested opening:

# CasePilot

**AI agents for complex casework.**

Organizations rarely make important decisions from one clean input.

A single case may require documents business rules customer history
missing information and human judgment.

CasePilot demonstrates an AI assisted workflow that can investigate a
case identify what it does not know request missing evidence and resume
the process when new information arrives.

The demo uses a fictional insurance claim.

The architecture is designed around a broader question:

> How can AI agents help with complex casework without turning the LLM
> into the business process itself?

Then explain:

``` text
The problem

The demo story

Architecture

Agent tools

Human in the loop

Retrieval

Decision trace

Testing

Security

Running locally
```

------------------------------------------------------------------------

# 41. What to say in the interview

A strong explanation:

> I wanted to build something closer to a real client problem than a
> chatbot.
>
> In many business processes the AI does not have enough information to
> finish the task immediately.
>
> So I built the workflow around uncertainty.
>
> The agent investigates the case and retrieves evidence. When critical
> information is missing it does not invent an answer. It proposes the
> next action.
>
> A human approves the external communication. When new information
> arrives the workflow resumes and the recommendation is recalculated.
>
> I also separated AI reasoning from deterministic business rules so the
> LLM does not control the entire process.

If asked why insurance:

> Insurance is useful for the demo because it naturally combines
> documents rules uncertainty financial consequences and human review.
> But the architecture is really about complex casework rather than
> insurance specifically.

If asked what you would improve for production:

``` text
proper identity and access management

production grade document pipeline

evaluation framework

model monitoring

calibrated decision scoring

stronger policy engine

real integrations

PII handling

retention policies

human review analytics

multi tenant isolation
```

------------------------------------------------------------------------

# 42. What makes the project impressive

The project should demonstrate that the developer understands that AI
software is still software.

The impressive parts are not:

``` text
a fancy prompt

a chatbot

a loading animation

calling an LLM
```

The impressive parts are:

``` text
workflow design

state management

tool boundaries

structured outputs

retrieval

evidence

uncertainty

human review

resumable execution

deterministic business rules

auditability

testing

clear UX
```

------------------------------------------------------------------------

# 43. Scope control

Do not build an entire insurance platform.

Do not build authentication first.

Do not build customer administration.

Do not build dozens of scenarios.

Do not build a generic no code agent builder.

Do not build billing.

Do not build multi tenancy.

Build one excellent case.

The goal is a polished portfolio demonstration.

The main case must work perfectly.

------------------------------------------------------------------------

# 44. MVP

The first complete version requires:

``` text
short landing page

case view

synthetic documents

agent plan

investigation timeline

policy retrieval

missing information detection

78% confidence state

generated information request

human approval

simulated repair company response

workflow resume

94% confidence state

final recommendation

source citations

decision trace

audit events

README

tests
```

Anything beyond this is secondary.

------------------------------------------------------------------------

# 45. Build order

## Phase 1

Build the static frontend story.

Make the entire recruiter journey work with deterministic mock data.

The UI and story must already feel excellent.

## Phase 2

Create FastAPI.

Add case state and API endpoints.

Move mock case data behind the API.

## Phase 3

Add the document retrieval pipeline.

Create synthetic PDFs.

Chunk them.

Embed them.

Return real source citations.

## Phase 4

Add LLM structured outputs.

Use the model for classification extraction planning and proposed
actions.

Keep business rules deterministic.

## Phase 5

Add resumable workflow orchestration.

Human approval and simulated external response should update case state.

## Phase 6

Add tests logging error states and deployment hardening.

------------------------------------------------------------------------

# 46. Definition of done

The project is successful when a recruiter can open the URL without
instructions and complete the journey.

Within the first 20 seconds they understand the business problem.

Within the first minute they see the agent actually working.

Within two minutes they see the system detect missing information.

Within three minutes they see a human approve the next action and the
agent resume.

At the end they understand why the recommendation changed.

They can inspect the evidence.

They can inspect the decision trace.

They can open GitHub and see clean architecture and tests.

Most importantly they should leave with one thought:

> **This is an AI agent that knows when it does not know enough to make
> a decision.**

------------------------------------------------------------------------

# 47. Final product principle

Do not optimize CasePilot for the number of AI features.

Optimize it for one believable story.

The project should show a transition from:

``` text
uncertain case
```

to:

``` text
structured investigation
```

to:

``` text
missing evidence
```

to:

``` text
human assisted next action
```

to:

``` text
new evidence
```

to:

``` text
explainable recommendation
```

That is the product.

Everything else exists to support that journey.
