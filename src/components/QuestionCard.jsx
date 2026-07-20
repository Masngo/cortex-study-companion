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
