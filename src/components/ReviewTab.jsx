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
