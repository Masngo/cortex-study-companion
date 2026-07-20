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
