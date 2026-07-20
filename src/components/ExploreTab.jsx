import React, { useState } from 'react';
import { Compass, Sparkles, Save, Code, CheckCircle2 } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';
import { callAI } from '../lib/ai.js';
import { EXPLORE_SYSTEM_PROMPT } from '../lib/prompts.js';
import { saveStudyItem } from '../lib/storage.js';
import Diagram from './Diagram.jsx';

export default function ExploreTab({ diagram, setDiagram, topic, setTopic, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('diagram');
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSaved(false);

    try {
      const rawText = await callAI(EXPLORE_SYSTEM_PROMPT, topic);
      let parsed = JSON.parse(rawText);
      
      if (!parsed || typeof parsed !== 'object' || !parsed.nodes) {
        throw new Error("Invalid architectural data blueprint format received.");
      }
      
      setDiagram(parsed);
      setActiveTab('diagram');
    } catch (err) {
      setErrorMsg(err.message || "Failed parsing network blueprint parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!diagram || !topic) return;
    saveStudyItem({ title: topic, diagram, timestamp: Date.now() });
    setSaved(true);
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="space-y-6">
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-5 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass size={18} color={TOKENS.gold} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Paste any topic or assignment</h2>
          </div>
          <p className="text-xs text-amber-300 font-medium">
            💡 Unrestricted Ingress Engine — Enter absolutely any engineering architecture, data schema, software workflow, or abstract concept to generate mapping vertices.
          </p>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., design an e-commerce logistics microservice, ride-sharing routing tracker, hospital system..."
            rows={3}
            style={{ background: TOKENS.blueprintDeep, color: '#ffffff' }}
            className="w-full rounded-sm border border-white/10 p-3 text-xs outline-none text-slate-900 resize-none"
          />

          <div className="flex justify-between items-center">
            {errorMsg ? (
              <span className="text-xs text-rose-300 font-mono bg-rose-950/40 px-2 py-1 rounded border border-rose-900/30">{errorMsg}</span>
            ) : <span />}
            
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold disabled:opacity-50 transition-transform active:scale-95"
            >
              <Sparkles size={14} />
              {loading ? 'Synthesizing Architecture...' : 'Build diagram'}
            </button>
          </div>
        </form>
      </div>

      {diagram && (
        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-5 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: TOKENS.line + '33' }}>
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                {diagram.type || 'System'}
              </span>
              <h3 className="text-base font-bold mt-1 text-white">{diagram.title || 'Architectural View'}</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-black/25 rounded-sm p-0.5 border border-white/10">
                <button
                  onClick={() => setActiveTab('diagram')}
                  style={{ background: activeTab === 'diagram' ? TOKENS.gold : 'transparent', color: activeTab === 'diagram' ? TOKENS.blueprintDeep : TOKENS.paper }}
                  className="px-3 py-1 text-xs font-medium rounded-sm"
                >
                  Diagram View
                </button>
                {diagram.code && (
                  <button
                    onClick={() => setActiveTab('code')}
                    style={{ background: activeTab === 'code' ? TOKENS.gold : 'transparent', color: activeTab === 'code' ? TOKENS.blueprintDeep : TOKENS.paper }}
                    className="px-3 py-1 text-xs font-medium rounded-sm flex items-center gap-1"
                  >
                    <Code size={12} /> Code / SQL
                  </button>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={saved}
                style={{ background: saved ? '#10B981' : TOKENS.paper, color: saved ? '#ffffff' : TOKENS.ink }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold shadow"
              >
                {saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
                {saved ? 'Saved to Log' : 'Save'}
              </button>
            </div>
          </div>

          <p className="text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded-sm border border-white/5">
            <strong className="text-cyan-300 font-mono block mb-1 text-[11px]">ARCHITECTURAL RATIONALE:</strong>
            {diagram.rationale || 'No technical summary provided.'}
          </p>

          {activeTab === 'diagram' ? (
            <Diagram diagram={diagram} />
          ) : (
            <div className="bg-slate-950 rounded-sm p-4 border border-cyan-500/20 overflow-x-auto">
              <pre className="text-xs font-mono text-cyan-200 leading-relaxed">{diagram.code?.content || 'No syntax target included.'}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
