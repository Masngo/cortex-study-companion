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
