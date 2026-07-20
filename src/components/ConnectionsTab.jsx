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
