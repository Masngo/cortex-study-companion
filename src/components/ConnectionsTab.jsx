import React, { useState, useEffect } from 'react';
import { Loader2, Share2, HelpCircle } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { getStudyItems } from '../lib/storage.js';
import { callAI } from '../lib/ai.js';
import { CONNECTIONS_SYSTEM_PROMPT } from '../lib/prompts.js';

export default function ConnectionsTab() {
  const [items, setItems] = useState([]);
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setItems(getStudyItems());
  }, []);

  const handleCompute = async () => {
    if (!leftId || !rightId || leftId === rightId) return;
    setLoading(true);
    setError(false);
    setResult(null);

    const leftItem = items.find(i => i.id === leftId);
    const rightItem = items.find(i => i.id === rightId);

    try {
      const payload = JSON.stringify({
        topicA: { title: leftItem.title, type: leftItem.diagram.type, nodes: leftItem.diagram.nodes.map(n => n.label) },
        topicB: { title: rightItem.title, type: rightItem.diagram.type, nodes: rightItem.diagram.nodes.map(n => n.label) }
      });

      const raw = await callAI(CONNECTIONS_SYSTEM_PROMPT, payload);
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
        <HelpCircle size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">
          You need at least two distinct entries saved in your Study Log to analyze system overlaps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 grid grid-cols-1 sm:grid-cols-7 gap-3 items-end">
        <div className="sm:col-span-3 flex flex-col space-y-1">
          <label className="text-[11px] font-mono tracking-wider opacity-70">TOPIC MATRIX ANCHOR A</label>
          <select
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
            className="w-full text-xs p-2 rounded-sm outline-none"
          >
            <option value="">Select first saved topic...</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>

        <div className="sm:col-span-1 text-center text-xs opacity-40 font-mono pb-2.5">CROSS</div>

        <div className="sm:col-span-3 flex flex-col space-y-1">
          <label className="text-[11px] font-mono tracking-wider opacity-70">TOPIC MATRIX ANCHOR B</label>
          <select
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
            className="w-full text-xs p-2 rounded-sm outline-none"
          >
            <option value="">Select secondary topic...</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompute}
          disabled={loading || !leftId || !rightId || leftId === rightId}
          style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Share2 size={13} />}
          {loading ? 'Analyzing Syntactic Overlaps...' : 'Compute System Relationship'}
        </button>
      </div>
      {error && <p className="text-xs text-red-300 text-center">Failed computing relationships — refresh and check API key parameters.</p>}

      {result && (
        <div style={{ background: TOKENS.paper, color: TOKENS.ink }} className="rounded-md p-5 space-y-4 shadow-xl">
          <div>
            <h4 style={{ fontFamily: "'Fraunces', serif" }} className="font-semibold text-base mb-1 text-blue-900">
              Structural Bridge Architecture
            </h4>
            <p className="text-sm leading-relaxed text-slate-700">{result.connection}</p>
          </div>

          {result.sharedConcepts && result.sharedConcepts.length > 0 && (
            <div className="border-t pt-3" style={{ borderColor: '#0000000a' }}>
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">Shared Concept Vertices</span>
              <div className="flex flex-wrap gap-1.5">
                {result.sharedConcepts.map((concept, i) => (
                  <span key={i} style={{ background: TOKENS.blueprintDeep + '12', color: TOKENS.blueprintDeep }} className="text-[11px] px-2 py-0.5 rounded-sm font-medium">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
