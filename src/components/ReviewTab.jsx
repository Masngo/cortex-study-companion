import React, { useState } from 'react';
import { Loader2, CheckSquare, MessageSquare } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { REVIEW_SYSTEM_PROMPT } from '../lib/prompts.js';

export default function ReviewTab() {
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const processReview = async () => {
    if (!submission.trim()) return;
    setLoading(true);
    setError(false);
    setFeedback(null);
    try {
      const raw = await callAI(REVIEW_SYSTEM_PROMPT, submission);
      setFeedback(JSON.parse(raw));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <CheckSquare size={14} color={TOKENS.gold} />
          <h3 style={{ color: TOKENS.paper }} className="text-[13px] font-semibold">Submit your draft work or solution</h3>
        </div>
        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder='Paste code, SQL blocks, text rationales, system designs, or math answers here for structural critique...'
          rows={5}
          style={{ background: TOKENS.paper, color: TOKENS.ink }}
          className="w-full text-sm px-3 py-2 rounded-sm outline-none resize-none placeholder:text-black/40"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={processReview}
            disabled={loading}
            style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold flex-shrink-0"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <MessageSquare size={13} />}
            {loading ? 'Analyzing...' : 'Get Structure Feedback'}
          </button>
        </div>
        {error && <p style={{ color: '#f5a3a3' }} className="text-[11px] mt-1.5">Analysis failed — try shortening your snippet.</p>}
      </div>

      {feedback && (
        <div style={{ background: TOKENS.paper }} className="rounded-md p-5 space-y-4">
          <div>
            <h4 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold text-sm mb-1">What You Handled Well</h4>
            <p style={{ color: TOKENS.ink }} className="text-[13px] leading-relaxed">{feedback.strengths}</p>
          </div>
          <div className="border-t pt-3" style={{ borderColor: '#0000000a' }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold text-sm mb-1">Structural Flaws & Gap Realities</h4>
            <ul className="list-disc pl-4 space-y-1 text-[13px]" style={{ color: TOKENS.ink }}>
              {feedback.gaps.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
          <div className="border-t pt-3" style={{ borderColor: '#0000000a' }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold text-sm mb-1">Refactored / Recommended Version</h4>
            <pre style={{ background: TOKENS.blueprintDeep, color: TOKENS.paper, fontFamily: "'JetBrains Mono', monospace" }} className="p-3 text-[11px] overflow-auto rounded-sm mt-1 leading-relaxed">
              <code>{feedback.refactoredVersion}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
