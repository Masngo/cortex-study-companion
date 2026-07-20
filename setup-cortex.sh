#!/bin/bash
# Cortex — AI Study Companion — project scaffold
# Run this with: bash setup-cortex.sh  (don't paste the raw content into the terminal)
set -e

mkdir -p "cortex-app"
cd "cortex-app"

cat > ".env.example" << 'CORTEX_EOF'
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-5.6
PORT=3001
CORTEX_EOF

cat > ".gitignore" << 'CORTEX_EOF'
node_modules/
dist/
.env
.DS_Store
*.log
CORTEX_EOF

cat > "LICENSE" << 'CORTEX_EOF'
MIT License

Copyright (c) 2026 Cortex Study Companion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
CORTEX_EOF

cat > "README.md" << 'CORTEX_EOF'
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

- Session reference: `/feedback` session ID — _add here_

## Notes on the model

The `server/index.js` file references the model as `"gpt-5.6"` via `OPENAI_MODEL` — double-check the exact API model identifier in OpenAI's docs at build time, since marketing names and API slugs occasionally differ.

## License

MIT (or your preferred license) — update before making the repository public.
CORTEX_EOF

cat > "index.html" << 'CORTEX_EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cortex — AI Study Companion</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
CORTEX_EOF

cat > "package.json" << 'CORTEX_EOF'
{
  "name": "cortex-study-companion",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "node server/index.js",
    "client": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.383.0",
    "recharts": "^2.12.7",
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.41",
    "autoprefixer": "^10.4.20",
    "concurrently": "^8.2.2"
  }
}
CORTEX_EOF

cat > "postcss.config.js" << 'CORTEX_EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
CORTEX_EOF

cat > "tailwind.config.js" << 'CORTEX_EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
CORTEX_EOF

cat > "vite.config.js" << 'CORTEX_EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
CORTEX_EOF

mkdir -p "server"
cat > "server/index.js" << 'CORTEX_EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// POST /api/generate
// body: { system: string, prompt: string, maxTokens?: number }
// Proxies to OpenAI's chat completions endpoint using GPT-5.6, so the API
// key never reaches the browser. Returns { text: string }.
app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server (see .env.example)' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // NOTE: confirm the exact model identifier string in OpenAI's docs
        // at build time — "gpt-5.6" is the model name as referenced by the
        // hackathon; API model slugs occasionally differ from marketing names.
        model: process.env.OPENAI_MODEL || 'gpt-5.6',
        max_tokens: maxTokens || 1800,
        messages: [
          { role: 'system', content: system || '' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API error:', response.status, errText);
      return res.status(502).json({ error: 'Upstream AI request failed' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    res.json({ text: text.replace(/```json|```/g, '').trim() });
  } catch (err) {
    console.error('Server error calling OpenAI:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));
CORTEX_EOF

mkdir -p "src"
cat > "src/App.jsx" << 'CORTEX_EOF'
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { TOKENS } from './lib/tokens.js';
import ExploreTab from './components/ExploreTab.jsx';
import ReviewTab from './components/ReviewTab.jsx';
import PracticeTab from './components/PracticeTab.jsx';
import SavedTab from './components/SavedTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import ConnectionsTab from './components/ConnectionsTab.jsx';

const TABS = [
  ['explore', 'Explore a topic'],
  ['review', 'Review my work'],
  ['practice', 'Practice'],
  ['connections', 'Connections'],
  ['dashboard', 'Dashboard'],
  ['saved', 'Study log'],
];

export default function App() {
  const [tab, setTab] = useState('explore');
  const [diagram, setDiagram] = useState(null);
  const [topic, setTopic] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const openSaved = (savedDiagram, savedTopic) => {
    setDiagram(savedDiagram);
    setTopic(savedTopic || '');
    setTab('explore');
  };

  return (
    <div style={{ background: TOKENS.blueprint, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }} className="p-5 sm:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
      `}</style>

      <div className="flex items-center gap-2 mb-1">
        <div style={{ background: TOKENS.gold }} className="p-2 rounded-sm">
          <Brain size={20} color={TOKENS.blueprintDeep} />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.paper }} className="text-xl font-semibold leading-tight">
            Cortex
          </h1>
          <p style={{ color: '#ffffff77' }} className="text-[12px]">An AI study companion — turn any topic into a diagram, an explanation, and practice</p>
        </div>
      </div>

      <div className="flex gap-1 mt-6 mb-5 flex-wrap">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: tab === key ? TOKENS.paper : 'transparent',
              color: tab === key ? TOKENS.ink : '#ffffffaa',
            }}
            className="px-4 py-1.5 rounded-sm text-sm font-medium"
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'explore' && (
        <ExploreTab
          diagram={diagram}
          setDiagram={setDiagram}
          topic={topic}
          setTopic={setTopic}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
      {tab === 'review' && <ReviewTab />}
      {tab === 'practice' && <PracticeTab diagram={diagram} />}
      {tab === 'connections' && <ConnectionsTab refreshKey={refreshKey} />}
      {tab === 'dashboard' && <DashboardTab refreshKey={refreshKey} />}
      {tab === 'saved' && <SavedTab refreshKey={refreshKey} onOpen={openSaved} />}
    </div>
  );
}
CORTEX_EOF

cat > "src/index.css" << 'CORTEX_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
}
CORTEX_EOF

cat > "src/main.jsx" << 'CORTEX_EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
CORTEX_EOF

mkdir -p "src/components"
cat > "src/components/ConnectionsTab.jsx" << 'CORTEX_EOF'
import React, { useEffect, useState } from 'react';
import { Loader2, Network } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { CONNECTIONS_SYSTEM_PROMPT } from '../lib/prompts.js';
import { getStudyItems } from '../lib/storage.js';

export default function ConnectionsTab({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [aId, setAId] = useState('');
  const [bId, setBId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const list = getStudyItems();
    setItems(list);
    if (list.length >= 2) {
      setAId((prev) => prev || list[0].id);
      setBId((prev) => prev || list[1].id);
    }
  }, [refreshKey]);

  const explain = async () => {
    const a = items.find((i) => i.id === aId);
    const b = items.find((i) => i.id === bId);
    if (!a || !b || a.id === b.id) return;
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const prompt = JSON.stringify({
        topicA: { title: a.diagram.title, type: a.diagram.type, nodes: a.diagram.nodes.map((n) => n.label) },
        topicB: { title: b.diagram.title, type: b.diagram.type, nodes: b.diagram.nodes.map((n) => n.label) },
      });
      const raw = await callAI(CONNECTIONS_SYSTEM_PROMPT, prompt);
      setResult(JSON.parse(raw));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (items.length < 2) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <Network size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Save at least two topics to your Study Log to see how they connect.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Network size={14} color={TOKENS.gold} />
          <h3 style={{ color: TOKENS.paper }} className="text-[13px] font-semibold">Compare two things you've studied</h3>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={aId}
            onChange={(e) => setAId(e.target.value)}
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
            className="text-sm px-3 py-2 rounded-sm outline-none flex-1 min-w-[160px]"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
          <span style={{ color: '#ffffff88' }} className="text-sm">and</span>
          <select
            value={bId}
            onChange={(e) => setBId(e.target.value)}
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
            className="text-sm px-3 py-2 rounded-sm outline-none flex-1 min-w-[160px]"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
        </div>
        <button
          onClick={explain}
          disabled={loading || aId === bId}
          style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Network size={13} />}
          {loading ? 'Thinking...' : 'Explain the connection'}
        </button>
        {aId === bId && <p style={{ color: '#f5a3a3' }} className="text-[11px] mt-1.5">Pick two different topics.</p>}
        {error && <p style={{ color: '#f5a3a3' }} className="text-[11px] mt-1.5">Couldn't generate that — try again.</p>}
      </div>

      {result && (
        <div style={{ background: TOKENS.paper }} className="rounded-md p-5">
          <p style={{ color: TOKENS.ink }} className="text-[14px] leading-relaxed">{result.connection}</p>
          {result.sharedConcepts && result.sharedConcepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {result.sharedConcepts.map((c, i) => (
                <span
                  key={i}
                  style={{ background: TOKENS.goodSoft, color: TOKENS.good }}
                  className="text-[11px] font-medium px-2 py-1 rounded-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/DashboardTab.jsx" << 'CORTEX_EOF'
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, BookMarked, Target, Flame } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, getStats } from '../lib/storage.js';

function StatCard({ icon, label, value }) {
  return (
    <div style={{ background: TOKENS.blueprintDeep }} className="rounded-md p-4 flex items-center gap-3 flex-1 min-w-[140px]">
      <div style={{ background: TOKENS.gold + '22', color: TOKENS.gold }} className="p-2 rounded-sm">
        {icon}
      </div>
      <div>
        <p style={{ color: '#ffffff99' }} className="text-[11px] uppercase tracking-wide">{label}</p>
        <p style={{ color: TOKENS.paper, fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardTab({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setItems(getStudyItems());
    setStats(getStats());
  }, [refreshKey]);

  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : null;

  const typeColors = {
    schema: TOKENS.gold,
    process: TOKENS.rust,
    architecture: TOKENS.line,
    concept_map: TOKENS.good,
  };

  const chartData = Object.keys(TYPE_LABELS).map((key) => ({
    name: TYPE_LABELS[key],
    count: items.filter((i) => i.diagram.type === key).length,
    key,
  }));

  return (
    <div>
      <div className="flex gap-3 flex-wrap mb-6">
        <StatCard icon={<BookMarked size={18} />} label="Topics studied" value={items.length} />
        <StatCard icon={<Target size={18} />} label="Practice accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
        <StatCard icon={<Flame size={18} />} label="Questions answered" value={total} />
      </div>

      {items.length === 0 ? (
        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
          <LayoutDashboard size={22} color={TOKENS.gold} className="mx-auto mb-2" />
          <p style={{ color: '#ffffffaa' }} className="text-sm">Explore a few topics to start seeing your study patterns here.</p>
        </div>
      ) : (
        <>
          <div style={{ background: TOKENS.paper }} className="rounded-md p-5">
            <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold mb-4">Topics by type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: TOKENS.inkSoft }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: TOKENS.inkSoft }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#00000008' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={typeColors[entry.key]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: TOKENS.paper }} className="rounded-md p-5 mt-4">
            <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold mb-3">Recent activity</h3>
            <div className="space-y-2">
              {items.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: '#00000010' }}>
                  <span style={{ color: TOKENS.ink }}>{entry.title}</span>
                  <span style={{ color: TOKENS.inkSoft }} className="text-[11px] font-mono">{new Date(entry.savedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/Diagram.jsx" << 'CORTEX_EOF'
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Brain } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';

function NodeCard({ node, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{ background: TOKENS.paper, borderColor: TOKENS.line + '55' }}
      className="rounded-md border-2 w-64 shadow-lg flex-shrink-0"
    >
      <div style={{ background: TOKENS.ink }} className="px-3 py-2 rounded-t-sm flex items-center gap-1.5">
        <Brain size={13} color={TOKENS.gold} />
        <span style={{ color: TOKENS.paper, fontFamily: "'JetBrains Mono', monospace" }} className="text-[13px] font-semibold">
          {node.label}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">
        {node.detail.map((d, i) => (
          <p key={i} style={{ color: TOKENS.ink, fontFamily: "'JetBrains Mono', monospace" }} className="text-[12px] leading-snug">
            {d}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Diagram({ diagram }) {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [lines, setLines] = useState([]);

  useLayoutEffect(() => {
    if (!diagram) return;
    const compute = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const newLines = (diagram.edges || [])
        .map((e) => {
          const fromEl = cardRefs.current[e.from];
          const toEl = cardRefs.current[e.to];
          if (!fromEl || !toEl) return null;
          const fr = fromEl.getBoundingClientRect();
          const tr = toEl.getBoundingClientRect();
          const x1 = fr.left + fr.width / 2 - containerRect.left;
          const y1 = fr.top + fr.height / 2 - containerRect.top;
          const x2 = tr.left + tr.width / 2 - containerRect.left;
          const y2 = tr.top + tr.height / 2 - containerRect.top;
          return { key: e.from + '-' + e.to, x1, y1, x2, y2, label: e.label, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
        })
        .filter(Boolean);
      setLines(newLines);
    };
    const t = setTimeout(compute, 30);
    window.addEventListener('resize', compute);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', compute);
    };
  }, [diagram]);

  return (
    <div
      ref={containerRef}
      style={{
        background: TOKENS.blueprintDeep,
        backgroundImage: `radial-gradient(${TOKENS.line}22 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      }}
      className="relative rounded-md p-6 overflow-auto"
    >
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {lines.map((l) => (
          <g key={l.key}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={TOKENS.line} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            <circle cx={l.x1} cy={l.y1} r="3" fill={TOKENS.line} />
            <circle cx={l.x2} cy={l.y2} r="3" fill={TOKENS.line} />
            {l.label && (
              <text x={l.mx} y={l.my - 4} fill={TOKENS.gold} fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
                {l.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-8 relative" style={{ zIndex: 1 }}>
        {diagram.nodes.map((n) => (
          <NodeCard key={n.id} node={n} cardRef={(el) => (cardRefs.current[n.id] = el)} />
        ))}
      </div>
    </div>
  );
}
CORTEX_EOF

cat > "src/components/ExploreTab.jsx" << 'CORTEX_EOF'
import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, Code2, Save, ChevronDown, ChevronUp, Copy, Check, Compass } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { EXPLORE_SYSTEM_PROMPT } from '../lib/prompts.js';
import { saveStudyItem } from '../lib/storage.js';
import Diagram from './Diagram.jsx';

export default function ExploreTab({ diagram, setDiagram, topic, setTopic, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(false);
    setDiagram(null);
    try {
      const raw = await callAI(EXPLORE_SYSTEM_PROMPT, topic);
      setDiagram(JSON.parse(raw));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(diagram.code.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* clipboard may be unavailable — code is still visible to select manually */
    }
  };

  const save = () => {
    if (!diagram) return;
    setSaving(true);
    try {
      const id = 'study_' + Date.now();
      const entry = { id, title: diagram.title || topic.slice(0, 60), topic, diagram, savedAt: new Date().toISOString() };
      saveStudyItem(entry);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Compass size={14} color={TOKENS.gold} />
          <h3 style={{ color: TOKENS.paper }} className="text-[13px] font-semibold">Paste any topic or assignment</h3>
        </div>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='Any subject — e.g. "design a database for a library system", "explain how TCP handshakes work", "outline the water cycle", "how does a hash table resolve collisions"'
          rows={3}
          style={{ background: TOKENS.paper, color: TOKENS.ink }}
          className="w-full text-sm px-3 py-2 rounded-sm outline-none resize-none placeholder:text-black/40"
        />
        <div className="flex items-center justify-between mt-2">
          <p style={{ color: '#ffffff66' }} className="text-[11px]">It figures out the right kind of diagram for the topic — schema, process, architecture, or concept map.</p>
          <button
            onClick={generate}
            disabled={loading}
            style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold flex-shrink-0"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {loading ? 'Thinking...' : 'Build diagram'}
          </button>
        </div>
        {error && <p style={{ color: '#f5a3a3' }} className="text-[11px] mt-1.5">Couldn't generate that — try adding a bit more detail.</p>}
      </div>

      {diagram && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm">
              {TYPE_LABELS[diagram.type] || diagram.type}
            </span>
            <h3 style={{ color: TOKENS.paper, fontFamily: "'Fraunces', serif" }} className="font-semibold">{diagram.title}</h3>
          </div>

          <Diagram diagram={diagram} />

          <div style={{ background: TOKENS.paper }} className="rounded-md p-5 mt-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Lightbulb size={15} color={TOKENS.gold} />
              <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold">Why it's put together this way</h3>
            </div>
            <ul className="space-y-2">
              {diagram.rationale.map((r, i) => (
                <li key={i} style={{ color: TOKENS.ink }} className="text-[13px] flex items-start gap-2">
                  <span style={{ color: TOKENS.gold }} className="font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {diagram.code && diagram.code.language && (
            <div style={{ background: TOKENS.paper }} className="rounded-md p-5 mt-4">
              <button onClick={() => setShowCode((s) => !s)} className="flex items-center gap-1.5 w-full justify-between">
                <span style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold flex items-center gap-1.5">
                  <Code2 size={15} color={TOKENS.rust} /> {diagram.code.language === 'sql' ? 'Runnable SQL' : 'Reference pseudocode'}
                </span>
                {showCode ? <ChevronUp size={16} color={TOKENS.inkSoft} /> : <ChevronDown size={16} color={TOKENS.inkSoft} />}
              </button>
              {showCode && (
                <div className="mt-3">
                  <pre
                    style={{ background: TOKENS.blueprintDeep, color: TOKENS.line, fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[12px] p-3 rounded-sm overflow-x-auto whitespace-pre-wrap"
                  >
                    {diagram.code.content}
                  </pre>
                  <button
                    onClick={copyCode}
                    style={{ borderColor: TOKENS.ink, color: TOKENS.ink }}
                    className="mt-2 text-[12px] font-medium border rounded-sm px-3 py-1.5 flex items-center gap-1.5"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy code'}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            style={{ background: TOKENS.ink, color: TOKENS.paper }}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-semibold"
          >
            {savedFlash ? <Check size={14} /> : <Save size={14} />}
            {savedFlash ? 'Saved to Study Log' : saving ? 'Saving...' : 'Save to Study Log'}
          </button>
        </>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/PracticeTab.jsx" << 'CORTEX_EOF'
import React, { useState, useEffect } from 'react';
import { Loader2, FlaskConical, TrendingUp } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { PRACTICE_SYSTEM_PROMPT } from '../lib/prompts.js';
import { getStats, recordAnswer } from '../lib/storage.js';
import QuestionCard from './QuestionCard.jsx';

export default function PracticeTab({ diagram }) {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setStats(getStats());
  }, []);

  const recordMark = (result) => {
    setStats(recordAnswer(result));
  };

  const generate = async () => {
    setLoading(true);
    setError(false);
    setQuestions(null);
    try {
      const raw = await callAI(PRACTICE_SYSTEM_PROMPT, JSON.stringify({ diagram, recentPerformance: stats }));
      const parsed = JSON.parse(raw);
      setQuestions(parsed.questions);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!diagram) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <FlaskConical size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Build a diagram first — practice questions are generated from it directly.</p>
      </div>
    );
  }

  const total = stats.correct + stats.incorrect;

  return (
    <div>
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p style={{ color: '#ffffffaa' }} className="text-[12px]">Practice questions written against "{diagram.title}."</p>
          {total > 0 && (
            <p style={{ color: TOKENS.gold }} className="text-[11px] flex items-center gap-1 mt-1">
              <TrendingUp size={11} /> {stats.correct}/{total} correct so far — new questions adjust to this
            </p>
          )}
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <FlaskConical size={13} />}
          {loading ? 'Writing questions...' : questions ? 'Regenerate questions' : 'Generate practice questions'}
        </button>
      </div>
      {error && <p style={{ color: TOKENS.issue }} className="text-[12px] mb-3">Couldn't generate questions — try again.</p>}
      {questions && (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <QuestionCard key={i} q={q} index={i} onMark={recordMark} />
          ))}
        </div>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/QuestionCard.jsx" << 'CORTEX_EOF'
import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';

export default function QuestionCard({ q, index, onMark }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [marked, setMarked] = useState(null);

  const mark = (result) => {
    setMarked(result);
    onMark(result);
  };

  return (
    <div style={{ background: TOKENS.paper }} className="rounded-md p-4">
      <p style={{ color: TOKENS.ink }} className="text-[13px] font-medium mb-2">
        <span style={{ color: TOKENS.gold }} className="font-mono text-xs mr-1.5">{String(index + 1).padStart(2, '0')}</span>
        {q.prompt}
      </p>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowHint((s) => !s)} style={{ color: TOKENS.rust }} className="text-[11px] font-medium flex items-center gap-1">
          <HelpCircle size={11} /> {showHint ? 'Hide hint' : 'Show hint'}
        </button>
        <button onClick={() => setShowAnswer((s) => !s)} style={{ color: TOKENS.good }} className="text-[11px] font-medium flex items-center gap-1">
          <CheckCircle2 size={11} /> {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>
        {showAnswer && marked === null && (
          <>
            <button onClick={() => mark('correct')} style={{ color: TOKENS.good }} className="text-[11px] font-medium">I got it right</button>
            <button onClick={() => mark('incorrect')} style={{ color: TOKENS.issue }} className="text-[11px] font-medium">I missed it</button>
          </>
        )}
        {marked && (
          <span style={{ color: marked === 'correct' ? TOKENS.good : TOKENS.issue }} className="text-[11px] font-medium">
            {marked === 'correct' ? 'Marked correct' : 'Marked for review'}
          </span>
        )}
      </div>
      {showHint && <p style={{ color: TOKENS.inkSoft }} className="text-[12px] italic mt-2">{q.hint}</p>}
      {showAnswer && (
        <pre style={{ background: TOKENS.blueprintDeep, color: TOKENS.line, fontFamily: "'JetBrains Mono', monospace" }} className="text-[12px] p-2.5 rounded-sm mt-2 overflow-x-auto whitespace-pre-wrap">
          {q.answer}
        </pre>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/ReviewTab.jsx" << 'CORTEX_EOF'
import React, { useState } from 'react';
import { Loader2, ClipboardCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { REVIEW_SYSTEM_PROMPT } from '../lib/prompts.js';

export default function ReviewTab() {
  const [context, setContext] = useState('');
  const [work, setWork] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const review = async () => {
    if (!work.trim()) return;
    setLoading(true);
    setError(false);
    setFeedback(null);
    try {
      const prompt = `Context / assignment: ${context || '(not provided)'}\n\nStudent's work:\n${work}`;
      const raw = await callAI(REVIEW_SYSTEM_PROMPT, prompt);
      setFeedback(JSON.parse(raw));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 mb-5 space-y-3">
        <div>
          <label style={{ color: '#ffffffaa' }} className="text-[11px] uppercase tracking-wide">Context (optional, helps accuracy)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="The assignment, prompt, or goal this work is for"
            rows={2}
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
            className="w-full text-sm px-3 py-2 rounded-sm outline-none resize-none mt-1 placeholder:text-black/40"
          />
        </div>
        <div>
          <label style={{ color: '#ffffffaa' }} className="text-[11px] uppercase tracking-wide">Your work</label>
          <textarea
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder="Paste a schema, code, an outline, a design, an argument — anything you're working on"
            rows={5}
            style={{ background: TOKENS.paper, color: TOKENS.ink, fontFamily: "'JetBrains Mono', monospace" }}
            className="w-full text-[13px] px-3 py-2 rounded-sm outline-none resize-none mt-1 placeholder:text-black/30"
          />
        </div>
        <button
          onClick={review}
          disabled={loading}
          style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <ClipboardCheck size={13} />}
          {loading ? 'Reviewing...' : 'Review my work'}
        </button>
        {error && <p style={{ color: '#f5a3a3' }} className="text-[11px]">Couldn't review that — check the format and try again.</p>}
      </div>

      {feedback && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={{ background: TOKENS.goodSoft }} className="rounded-md p-4">
            <h4 style={{ color: TOKENS.good }} className="text-[12px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> What's working
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} style={{ color: TOKENS.ink }} className="text-[13px]">{s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: TOKENS.issueSoft }} className="rounded-md p-4">
            <h4 style={{ color: TOKENS.issue }} className="text-[12px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle size={13} /> Worth fixing
            </h4>
            <ul className="space-y-2">
              {feedback.issues.map((s, i) => (
                <li key={i} style={{ color: TOKENS.ink }} className="text-[13px]">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
CORTEX_EOF

cat > "src/components/SavedTab.jsx" << 'CORTEX_EOF'
import React, { useState, useEffect } from 'react';
import { FolderOpen, Trash2 } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, deleteStudyItem } from '../lib/storage.js';

export default function SavedTab({ refreshKey, onOpen }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(getStudyItems());
  }, [refreshKey]);

  const remove = (id) => {
    deleteStudyItem(id);
    setSaved((prev) => prev.filter((e) => e.id !== id));
  };

  if (saved.length === 0) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <FolderOpen size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Nothing saved yet — build a diagram and hit "Save to Study Log."</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {saved.map((entry) => (
        <div key={entry.id} style={{ background: TOKENS.paper }} className="rounded-md p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }} className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm">
                {TYPE_LABELS[entry.diagram.type] || entry.diagram.type}
              </span>
              <p style={{ color: TOKENS.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold text-sm">{entry.title}</p>
            </div>
            <p style={{ color: TOKENS.inkSoft }} className="text-[11px] mt-1">{entry.diagram.nodes.length} nodes · saved {new Date(entry.savedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onOpen(entry.diagram, entry.topic)}
              style={{ background: TOKENS.ink, color: TOKENS.paper }}
              className="text-[12px] font-medium px-3 py-1.5 rounded-sm"
            >
              Open
            </button>
            <button
              onClick={() => remove(entry.id)}
              style={{ color: TOKENS.issue }}
              className="text-[12px] font-medium px-2 py-1.5 rounded-sm flex items-center gap-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
CORTEX_EOF

mkdir -p "src/lib"
cat > "src/lib/ai.js" << 'CORTEX_EOF'
// Calls our own backend (server/index.js), which holds the OpenAI API key.
// The browser never sees the key — this is important for a real submission,
// not just a nicety, since anything shipped client-side is publicly readable.
export async function callAI(system, prompt, maxTokens = 1800) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt, maxTokens }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'AI request failed');
  }
  const data = await res.json();
  return data.text;
}
CORTEX_EOF

cat > "src/lib/prompts.js" << 'CORTEX_EOF'
export const EXPLORE_SYSTEM_PROMPT = `You are an AI study companion that helps students across ANY subject — computer science, business, natural sciences, humanities, engineering — turn a topic or assignment into a visual diagram and a plain-language explanation. Given a topic or assignment description, decide the most natural diagram type for it, then return ONLY a JSON object, no markdown fences, no preamble, in exactly this shape:
{
  "type": "schema" | "process" | "architecture" | "concept_map",
  "title": "short 2-5 word title for this diagram",
  "nodes": [ { "id": "short_id", "label": "Node Name", "detail": ["bullet 1", "bullet 2"] } ],
  "edges": [ { "from": "short_id", "to": "short_id", "label": "short relationship label" } ],
  "rationale": ["short bullet explaining one key design or conceptual decision, under 22 words, written for a student"],
  "code": { "language": "sql" | "pseudocode" | null, "content": "runnable or reference code if genuinely useful, else empty string" }
}
Rules:
- Use "schema" for anything about databases or data modeling. Use "process" for algorithms, workflows, or sequences of steps. Use "architecture" for systems made of interacting components (web apps, networks, APIs). Use "concept_map" for theoretical or conceptual topics with no natural structural diagram.
- 3-7 nodes. For "schema" type: mark primary key fields with a leading "🔑 " and foreign key fields with a leading "🔗 " inside the relevant detail string, and put real CREATE TABLE SQL in code.content with code.language "sql".
- For "process" type, node order should reflect step order, and code.content may hold short pseudocode with code.language "pseudocode" if useful.
- For "architecture" or "concept_map", only set code.language when a real snippet is genuinely useful; otherwise code.language must be null and code.content "".
- rationale needs 4-6 bullets, each under 22 words, written for a student rather than an expert.`;

export const REVIEW_SYSTEM_PROMPT = `You are an AI study companion reviewing a student's own work-in-progress for any subject — a database schema, a piece of code, an essay outline, a design, an argument, a plan. Given optional context and the student's work, return ONLY a JSON object, no markdown fences: { "strengths": ["short specific strength referencing their actual content"], "issues": ["short specific issue with a concrete suggested fix"] }. Give 2-4 strengths and 2-6 issues. Be concrete — reference what they actually wrote, never generic textbook advice.`;

export const PRACTICE_SYSTEM_PROMPT = `You are an AI study companion generating practice questions based on a diagram a student just explored, calibrated to their recent performance. Return ONLY a JSON object, no markdown fences: { "questions": [ {"prompt": "a question appropriate to the diagram's type", "hint": "a short nudge, not the answer", "answer": "a full model answer"} ] }.
Match question style to the diagram's "type": SQL queries for "schema", step-tracing or "what happens if" questions for "process", scenario/design-tradeoff questions for "architecture", and explain/compare/apply questions for "concept_map". Generate 4-6 questions of increasing difficulty using only the exact node names given. If recent performance shows the student struggling, make the first 1-2 questions easier and build up more gradually; if they're doing well, start harder.`;

export const CONNECTIONS_SYSTEM_PROMPT = `You are an AI study companion helping a student see connections across two things they've already studied. Given two diagrams (topic, type, nodes), explain how they relate — shared concepts, useful contrasts, or how understanding one deepens the other. Return ONLY a JSON object, no markdown fences: { "connection": "a clear 3-5 sentence explanation, concrete and specific", "sharedConcepts": ["short phrase", "short phrase"] }. Reference the actual node names from both diagrams. If the two topics genuinely don't have a meaningful connection, say so honestly rather than forcing one — do not pad with generic filler.`;
CORTEX_EOF

cat > "src/lib/storage.js" << 'CORTEX_EOF'
const ITEMS_KEY = 'cortex_study_items';
const STATS_KEY = 'cortex_practice_stats';

export function getStudyItems() {
  try {
    return JSON.parse(localStorage.getItem(ITEMS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveStudyItem(entry) {
  const items = getStudyItems();
  items.unshift(entry);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  return true;
}

export function deleteStudyItem(id) {
  const items = getStudyItems().filter((i) => i.id !== id);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{"correct":0,"incorrect":0}');
  } catch (e) {
    return { correct: 0, incorrect: 0 };
  }
}

export function recordAnswer(result) {
  const stats = getStats();
  const next = { ...stats, [result === 'correct' ? 'correct' : 'incorrect']: stats[result === 'correct' ? 'correct' : 'incorrect'] + 1 };
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}
CORTEX_EOF

cat > "src/lib/tokens.js" << 'CORTEX_EOF'
export const TOKENS = {
  blueprint: '#16303D',
  blueprintDeep: '#0F232D',
  line: '#7FD8E8',
  paper: '#F6F2E8',
  ink: '#1E2B27',
  inkSoft: '#5C6B66',
  gold: '#E8B84B',
  rust: '#C77B4B',
  good: '#6FA97A',
  goodSoft: '#DCEBDD',
  issue: '#C15C5C',
  issueSoft: '#F3DBDB',
};

export const TYPE_LABELS = {
  schema: 'Data schema',
  process: 'Process / algorithm',
  architecture: 'System architecture',
  concept_map: 'Concept map',
};
CORTEX_EOF

echo "Project structure created successfully."
