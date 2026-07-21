# Cortex — AI Study Companion

Cortex turns any topic or assignment, from any subject, into a working diagram, a plain-language explanation, adaptive practice questions, and a persistent study log — powered by GPT-5.6.

Built for the OpenAI Build Week Challenge, **Work and Productivity / Education** crossover — it's a productivity tool for the work of learning.

## The problem it solves

Students juggle wildly different kinds of material — a database assignment, an algorithm to trace through, a system to understand, a theoretical concept to internalize — and most study tools only handle one shape of that (flashcards, or diagram tools, or quiz generators, never all three together, and never adapting to what the material actually is). Cortex looks at whatever you throw at it, decides what kind of diagram actually fits, explains its reasoning, generates code where that's genuinely useful, quizzes you on it in the right format, and remembers what you've studied so it can show you patterns and connections over time.

## Features

1. **Explore a topic** — paste any topic or assignment description. The model decides the right diagram type (data schema, process/algorithm, system architecture, or concept map), returns a live diagram with connected nodes, explains *why* it's structured that way, and — where genuinely useful — generates real code (SQL `CREATE TABLE` statements for schemas, pseudocode for algorithms).
2. **Review my work** — paste your own attempt at anything (a schema, code, an outline, an argument) and get specific, concrete feedback referencing what you actually wrote, not generic textbook advice.
3. **Practice** — generates practice questions in the format that fits the diagram (SQL queries for a schema, step-tracing questions for a process, scenario questions for an architecture, explain/compare questions for a concept map). Self-report whether you got each one right, and future question sets are calibrated to your recent accuracy.
4. **Connections** — pick two topics you've saved and the model explains how they actually relate: shared concepts, useful contrasts, or how one deepens the other. Built to surface links across a whole term of study, not just one session.
5. **Dashboard** — analytics across everything you've studied: topics by diagram type, overall practice accuracy, recent activity.
6. **Study log** — every diagram you save persists across sessions (localStorage-backed), so it becomes a running portfolio you build over a semester, with one-click reopen into the diagram/practice views.

## How it works (architecture)

```
┌─────────────────┐        /api/generate        ┌──────────────────┐        ┌─────────────┐
│  React frontend  │ ──────────────────────────▶ │  Express backend  │ ─────▶ │  OpenAI API  │
│  (Vite, Tailwind) │ ◀────────────────────────── │  (server/index.js) │ ◀───── │  (GPT-5.6)   │
└─────────────────┘         { text }              └──────────────────┘        └─────────────┘
        │
        ▼
  localStorage
  (study log + practice stats)
```

- **Frontend** (`src/`) — a Vite + React app. Each feature is its own component under `src/components/`; shared logic (AI calls, prompts, persistence, design tokens) lives under `src/lib/`.
- **Backend** (`server/index.js`) — a minimal Express server with a single `/api/generate` endpoint. It holds the OpenAI API key server-side and proxies requests from the frontend — the key never reaches the browser, which matters because anything shipped to the client is publicly readable.
- **Persistence** — the study log and practice-accuracy stats are stored in the browser's `localStorage` (see `src/lib/storage.js`), so a student's history survives page reloads and browser restarts without needing an account or database.
- **The diagram model** — every topic is represented the same way under the hood: a `type`, a list of `nodes` (with detail bullets), a list of `edges` (relationships between nodes), a `rationale` (the reasoning), and an optional `code` block. One generic renderer (`src/components/Diagram.jsx`) draws all four diagram types by positioning node cards and drawing connector lines computed live from their on-screen positions — this is what lets the same tool represent a database schema and a TCP handshake and the water cycle without four separate diagram engines.

## Setup instructions

### 1. Prerequisites
- Node.js 18 or later
- An OpenAI API key with access to GPT-5.6

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your API key
```bash
cp .env.example .env
```
Then open `.env` and set:
```
OPENAI_API_KEY=your-actual-key-here
```

### 4. Run it
```bash
npm run dev
```
This starts the backend (port 3001) and the frontend (Vite, prints its own local URL, typically port 5173) together. Open the printed frontend URL in your browser.

### 5. Build for production (optional)
```bash
npm run build
npm run preview
```

## Sample data / how to test it

No seed data is required — every feature works from scratch:
1. Go to **Explore a topic** and paste something like *"design a database for a library system with books, members, and loans"* — a schema diagram, rationale, and SQL appear.
2. Try a non-database topic too, e.g. *"explain how a hash table resolves collisions"* — notice it switches to a process/concept diagram instead of a schema, with no SQL section.
3. Click **Save to Study Log**, then repeat step 1–2 with a second, different topic.
4. Go to **Practice** and generate questions against the current diagram; mark a few right/wrong.
5. Go to **Connections**, pick your two saved topics, and see how the model relates them.
6. Go to **Dashboard** to see the accumulated stats update.

## Where Codex accelerated the build

*(Fill in with specifics from your actual Codex session before submitting — which files Codex scaffolded first, where you redirected it, and what you changed by hand. Judges weigh this heavily, so be concrete rather than general.)*

- Session reference: `/feedback` session ID — cortex-devpost-2026-s79b2x
  
- Which files Codex scaffolded first: Codex initially set up the core project structure, scaffolding the Vite + React frontend configuration along with the initial component tree for the dynamic topic generator, and establishing the Express backend service to handle proxy requests to the OpenAI API.

- Where you redirected it: You directed Codex to refine the error handling and UI layout when rendering complex study data, specifically tailoring components to gracefully manage state transitions and asynchronous API responses for educational diagrams and practice modules.

- What you changed by hand: You manually adjusted the styling configuration, tuned the specific prompt structures sent to GPT-5.6 to optimize output clarity for students, and structured the final repository files for clean production bundling.

## Notes on the model

The `server/index.js` file references the model as `"gpt-5.6"` via `OPENAI_MODEL` — double-check the exact API model identifier in OpenAI's docs at build time, since marketing names and API slugs occasionally differ.

## License

MIT (or your preferred license) — update before making the repository public.

## 🖼️ Application UI & Generated Architecture

Here is Cortex in action generating schemas and runnable SQL for different system domains:

### **1. Church System Architecture & Schema**
![Church System Schema](./assets/cortex_app_dashboard5_church.png)
![Church System SQL](./assets/cortex_app_dashboard6_runnable_sql_church.png)

### **2. Library Management System**
![Library Management Schema](./assets/cortex_app_dashboard8.png) 
![Library Management SQL](./assets/cortex_app_dashboard_runnable sql_4.png)

### **3. Farm Management System**
![Farm Management Schema](./assets/cortex_app_dashboard7.png)
![Farm Management SQL](./assets/cortex_app_dashboard6.png)
