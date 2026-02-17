# SoloLeveler

**A mobile scheduling app that learns your habits using a contextual bandit algorithm to build better plans over time.**

SoloLeveler removes the friction of daily planning. You define your goals and availability — the app generates an optimized weekly schedule automatically. What makes it different: the scheduling engine uses **LinUCB** (Linear Upper Confidence Bound), a contextual bandit algorithm that learns from every completed or skipped session, progressively adapting to how you actually work rather than relying on static rules.

---

## The Problem

Most scheduling apps are static. You manually place tasks, or the app uses fixed heuristics that treat every user the same. But people have different rhythms — a morning person thrives with deep work at 7am, while someone else peaks after lunch. Static schedulers can't learn this. They'll keep putting your hardest goal in a slot where you always skip it.

## The Solution

SoloLeveler starts with a brief onboarding to capture your chronotype, energy patterns, and work style. From there, the LinUCB engine builds an initial model and begins learning from real behavior. Every time you complete, skip, or miss a scheduled block, the model updates — so next week's schedule is smarter than this week's.

You tell it:
- **What** you want to accomplish (goals with target durations and deadlines)
- **When** you're free (availability rules with day/time preferences)
- **How you work** (onboarding preferences that warm-start the model)

The engine handles everything else.

---

## Key Features

### Adaptive Scheduling with LinUCB
The core differentiator. Instead of scoring goals with hand-tuned weights, each candidate `(goal, time slot)` pair is evaluated by a contextual bandit that incorporates ~30 features — user habits, goal attributes, time-of-day, energy patterns, completion history — and learns which combinations actually lead to task completion.

### Exploration vs. Exploitation
LinUCB's upper confidence bound naturally balances trying new placements (exploration) with using proven patterns (exploitation). New users see more variety as the model explores; established users get tightly optimized schedules. The exploration parameter (`alpha`) decays over time: heavy exploration in weeks 1-2, balanced through week 8, mostly exploitation after that.

### Cold-Start via Warm-Starting
A 5-question onboarding flow (chronotype, energy pattern, work style, session length, daily capacity) generates ~20-30 synthetic observations that initialize the model. The scheduler produces reasonable results from day one, and real data overrides these priors within 1-2 weeks.

### Flexible Goal Recurrence
Three modes with distinct scheduling semantics:
- **Daily** — "Meditate 15 min every day" (per-day tracking)
- **Weekly** — "Exercise 4 hours this week" (resets each Monday)
- **Total** — "Finish 8 hours of coursework" (cumulative until done)

### AI Daily Briefing
An LLM-powered summary that reviews today's scheduled tasks and generates a motivational checklist.

### Visual Day Timeline
A pixel-precise calendar with color-coded task pills, a live "now" indicator, week navigation, and workload dots. Tapping any block opens a bottom sheet editor.

### Gamification
XP, levels, streaks, and RPG-themed vocabulary (goals become quests, sessions earn XP) make routine scheduling feel like progression.

---

## How the Scheduling Engine Works

### Architecture

```
Frontend (Expo / React Native)
  ├── Clerk Auth → JWT in SecureStore
  ├── Onboarding flow → captures user preferences
  ├── DayTimeline → pixel-math calendar rendering
  └── Task completion → triggers reward signal

Express Backend (Node.js / TypeScript)
  ├── Auth, CRUD, data fetching
  ├── Schedule orchestration (slot generation, constraint enforcement)
  ├── Reward pipeline (status change → reward update)
  └── Calls ML service for goal ranking

Python ML Service (FastAPI / NumPy)
  ├── LinUCB engine (predict UCB, online update)
  ├── Feature engineering (~30-dim context vector)
  ├── Warm-start from onboarding preferences
  └── Per-user model persistence in MongoDB
```

### The Decision Problem

Each time the scheduler runs, it assigns goals to time slots. This is framed as a **contextual bandit**:

- **Arms**: Each candidate `(goal, slot)` pair
- **Context vector (x)**: ~30 features describing user state, goal attributes, and slot characteristics
- **Reward**: Observed after the scheduled time passes
  - Completed on time → **1.0**
  - Completed late (>30 min) → **0.5**
  - Skipped or missed → **0.0**

### LinUCB Core Math

For context vector **x** of dimension **d**:

```
theta = inv(A) * b

UCB(x) = theta' * x  +  alpha * sqrt(x' * inv(A) * x)
         -----------     ----------------------------
         exploitation            exploration
```

On observing reward **r**:

```
A <- A + x * x'
b <- b + r * x
```

The model maintains a single shared `A` matrix and `b` vector per user. No batch retraining — it updates online with every observation.

### Context Feature Vector (~30 dimensions)

| Category | Features |
|---|---|
| **User** | Chronotype (3), energy pattern (4), work style (3), preferred session length, streak, completion rate |
| **Goal** | Priority, deadline urgency, completion progress, recurrence type (3), goal-specific completion rate, days since last session |
| **Slot** | Hour of day, time-of-day (3), day of week (7), is weekend, slot duration, preference score, blocks/minutes already scheduled today |
| **Interaction** | Preferred time match, session length fit |

### Scheduling Pipeline

1. Fetch active goals, availability rules, and existing blocks
2. Expand availability rules into concrete time slots
3. Merge overlapping slots, subtract busy/pinned/completed blocks
4. Build all `(goal, freeSlot)` candidate pairs
5. Send candidates + user context to the Python ML service
6. Receive UCB-ranked scores for each candidate
7. Run greedy assignment using UCB scores (constraints — min/max sessions, buffer time, daily caps, no double-booking — enforced in Express)
8. Persist new schedule blocks
9. Log scheduling events (context vectors) for future reward updates

The constraint system stays entirely in Express. **LinUCB only influences ranking, never overrides hard constraints.** If the ML service is unavailable, the system falls back to a deterministic heuristic scorer (weighted composite of priority, deadline urgency, and completion progress).

### Reward Pipeline

```
User completes/skips block
  → Frontend PATCH /api/quests/:id
  → Express records timestamp, fires async reward update
  → Python retrieves stored context vector for that block
  → Computes reward based on status + timing
  → Updates user's LinUCB model: A += x*x', b += r*x
  → Next schedule generation uses the updated model
```

Missed blocks (scheduled but untouched 1+ hour past end time) are detected automatically and fed back as zero-reward observations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | Expo, React Native, TypeScript |
| Styling | NativeWind (Tailwind CSS for RN) |
| Navigation | Expo Router (file-based) |
| Auth | Clerk (JWT + SecureStore) |
| UI Components | @gorhom/bottom-sheet, custom timeline |
| Backend API | Node.js, Express, TypeScript |
| ML Service | Python, FastAPI, NumPy |
| Database | MongoDB (Mongoose + Motor) |
| AI Summaries | OpenAI GPT-4o-mini |
| Testing | Jest + pytest |

---

## Notable Engineering Decisions

- **LinUCB Disjoint with shared features** — Since arms (goal-slot pairs) are transient and change daily, using per-arm matrices would be wasteful. A single shared model with arm-specific features encoded in the context vector keeps the math lightweight (~microseconds per prediction for a 30-dim vector).
- **Heuristic fallback** — The LinUCB integration is purely additive. Users without onboarding, or moments when the Python service is down, fall back to the original deterministic scorer. No existing behavior breaks.
- **Non-blocking reward updates** — Status change hooks fire reward updates asynchronously. The user never waits for model updates.
- **Optimistic UI** — Task completion toggles update locally, then reconcile with the server. Rollback on failure keeps the interface responsive.
- **Strict API boundary** — Backend normalizes `_id` → `id`, returns ISO strings. Frontend maintains separate type definitions with explicit transform functions. No Mongoose types leak into React Native code.
- **Immutability rules** — User-created, pinned, completed, and skipped blocks are never touched by the scheduler. Only system-generated scheduled blocks are eligible for regeneration.
- **Debounced regeneration** — Goal/rule edits trigger schedule regeneration with a 2-second debounce to prevent redundant API calls during rapid editing.

---

## Screenshots

![SoloLeveler Hero](/projects/sololeveler.webp)

---

## What I Learned

- **Contextual bandits in production** — Framing scheduling as a bandit problem, designing a reward signal from user behavior, and handling cold-start with synthetic observations from onboarding preferences
- **Online learning design** — Building a system where the model updates with every interaction without batch retraining, and tuning exploration/exploitation tradeoffs via an alpha decay schedule
- **Microservice integration** — Orchestrating a Node.js API server with a Python ML service over HTTP, with graceful fallback when the ML service is unavailable
- **Feature engineering for scheduling** — Encoding user habits, temporal context, and goal attributes into a ~30-dimensional vector that captures the factors that actually predict task completion
- **Pixel-precise calendar UIs** — Absolute positioning with time-to-pixel math in React Native, handling overlapping events, live time indicators, and responsive week navigation
- **Constraint-based scheduling** — Slot algebra for time subtraction (handling all 5 geometric overlap cases), minimum session enforcement, buffer time, and per-day caps for recurring goals
