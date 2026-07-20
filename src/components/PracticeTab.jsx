import React, { useState, useEffect } from 'react';
import { Loader2, Target, Check, X, HelpCircle } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { PRACTICE_SYSTEM_PROMPT } from '../lib/prompts.js';
import { updateStats } from '../lib/storage.js';

export default function PracticeTab({ diagram }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setQuestions([]);
    setIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  }, [diagram]);

  const loadQuestions = async () => {
    if (!diagram) return;
    setLoading(true);
    setError(false);
    try {
      const payload = JSON.stringify({
        title: diagram.title,
        type: diagram.type,
        nodes: diagram.nodes.map((n) => ({ label: n.label, details: n.detail })),
      });
      const raw = await callAI(PRACTICE_SYSTEM_PROMPT, payload);
      setQuestions(JSON.parse(raw).questions || []);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScore = (isCorrect) => {
    updateStats(isCorrect);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (!diagram) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <HelpCircle size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Build or load a diagram first to generate matching practice challenges.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-5 text-center">
        <p style={{ color: TOKENS.paper }} className="text-sm mb-3 font-medium">Ready to test your comprehension of "{diagram.title}"?</p>
        <button
          onClick={loadQuestions}
          disabled={loading}
          style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
          className="mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-semibold"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Target size={13} />}
          {loading ? 'Building Questions...' : 'Generate Adaptive Set'}
        </button>
        {error && <p style={{ color: '#f5a3a3' }} className="text-[11px] mt-2">API call timed out. Please retry.</p>}
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ background: TOKENS.paper }} className="rounded-md p-6 text-center">
        <Target size={24} color={TOKENS.good} className="mx-auto mb-2" />
        <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold text-base">Practice Run Complete</h3>
        <p style={{ color: TOKENS.inkSoft }} className="text-xs mt-1 mb-4">Your dashboard marks have adjusted dynamically based on your self-reported inputs.</p>
        <button
          onClick={loadQuestions}
          style={{ background: TOKENS.ink, color: TOKENS.paper }}
          className="px-3 py-1.5 rounded-sm text-[12px] font-semibold"
        >
          Generate Another Set
        </button>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ background: TOKENS.paper }} className="rounded-md p-5">
      <div className="flex justify-between items-center mb-3 text-[11px] font-mono" style={{ color: TOKENS.inkSoft }}>
        <span>QUESTION {index + 1} OF {questions.length}</span>
        <span className="uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-black/5">{current.format}</span>
      </div>

      <p style={{ color: TOKENS.ink, fontFamily: "'Fraunces', serif" }} className="text-base font-semibold leading-snug mb-4">
        {current.prompt}
      </p>

      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          style={{ background: TOKENS.ink, color: TOKENS.paper }}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-sm"
        >
          Reveal Correct Verification Answer
        </button>
      ) : (
        <div className="mt-4 border-t pt-4 space-y-4" style={{ borderColor: '#0000000a' }}>
          <div>
            <span style={{ color: TOKENS.inkSoft }} className="text-[11px] font-mono block mb-1">CRITERIA / ANSWER MATRIX</span>
            <p style={{ color: TOKENS.ink }} className="text-sm leading-relaxed">{current.expected}</p>
          </div>
          <div style={{ background: TOKENS.blueprintDeep + '0b' }} className="p-3 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span style={{ color: TOKENS.ink }} className="text-[12px] font-medium">Evaluate your thinking objectively. Did you nail this?</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleScore(false)}
                style={{ background: TOKENS.rustSoft, color: TOKENS.rust }}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-sm"
              >
                <X size={12} /> Missed Details
              </button>
              <button
                onClick={() => handleScore(true)}
                style={{ background: TOKENS.goodSoft, color: TOKENS.good }}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-sm"
              >
                <Check size={12} /> Got It Right
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
