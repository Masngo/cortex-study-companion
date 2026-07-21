import React from 'react';
import { TOKENS } from '../lib/tokens.js';
import { Database, Layers } from 'lucide-react';

export default function Diagram({ diagram }) {
  if (!diagram) {
    return (
      <div className="p-8 text-center rounded-md border border-dashed" style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}>
        <p className="text-sm font-medium">No diagram built yet. Enter a topic above to generate one.</p>
      </div>
    );
  }

  // Handle case where diagram data might be nested inside a stringified text property
  let activeDiagram = diagram;
  if (typeof diagram.text === 'string') {
    try {
      activeDiagram = JSON.parse(diagram.text);
    } catch {
      // fallback if not valid JSON
    }
  } else if (diagram.data && typeof diagram.data === 'string') {
    try {
      activeDiagram = JSON.parse(diagram.data);
    } catch {}
  }

  const title = activeDiagram.title || diagram.title || 'Generated System Architecture';
  const type = activeDiagram.type || diagram.type || 'schema';
  const tables = activeDiagram.tables || activeDiagram.nodes || diagram.tables || diagram.nodes || [];
  const rationale = activeDiagram.rationale || diagram.rationale || [];
  const code = activeDiagram.code || diagram.code;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: TOKENS.line }}>
        <div className="flex items-center gap-2">
          <Database size={20} color={TOKENS.gold} />
          <h3 className="text-base font-bold" style={{ color: TOKENS.paper }}>
            {title}
          </h3>
        </div>
        <span className="text-xs uppercase px-2.5 py-1 rounded font-semibold tracking-wider" style={{ background: TOKENS.gold + '22', color: TOKENS.gold }}>
          {type}
        </span>
      </div>

      {/* Canvas Rendering Area */}
      <div 
        className="p-6 rounded-md border min-h-[320px] flex flex-wrap items-center justify-center gap-6 relative overflow-x-auto shadow-inner"
        style={{ background: TOKENS.blueprintDeep, borderColor: TOKENS.line }}
      >
        {Array.isArray(tables) && tables.length > 0 ? (
          tables.map((item, idx) => {
            const tableName = item.name || item.label || `Table ${idx + 1}`;
            const columns = item.columns || item.detail || item.data?.fields || item.data?.detail || [];

            return (
              <div 
                key={idx}
                className="rounded-md border shadow-xl min-w-[240px] max-w-[280px] overflow-hidden"
                style={{ background: TOKENS.paper, borderColor: TOKENS.line }}
              >
                <div className="px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b" style={{ background: TOKENS.blueprintDeep, color: TOKENS.paper, borderColor: TOKENS.line }}>
                  <Database size={14} color={TOKENS.gold} />
                  <span className="truncate">{tableName}</span>
                </div>
                <div className="p-3 space-y-1.5 text-xs font-mono" style={{ color: TOKENS.ink }}>
                  {Array.isArray(columns) && columns.map((col, cIdx) => (
                    <div key={cIdx} className="py-1 px-2 rounded flex items-center justify-between border border-transparent hover:border-gray-200" style={{ background: cIdx % 2 === 0 ? TOKENS.paperSubtle : 'transparent' }}>
                      <span className="truncate">{typeof col === 'string' ? col : col.name || JSON.stringify(col)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm font-medium" style={{ color: TOKENS.paper }}>No tables or nodes found to render.</p>
        )}
      </div>

      {/* Rationale */}
      {Array.isArray(rationale) && rationale.length > 0 && (
        <div className="p-4 rounded-md border space-y-2" style={{ background: TOKENS.paper, borderColor: TOKENS.line }}>
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: TOKENS.blueprintDeep }}>
            Architectural Rationale
          </h4>
          <ul className="space-y-1 text-sm pl-4 list-disc" style={{ color: TOKENS.inkSoft }}>
            {rationale.map((rat, rIdx) => (
              <li key={rIdx}>{rat}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Snippet */}
      {code && code.content && (
        <div className="rounded-md border overflow-hidden shadow-md" style={{ borderColor: TOKENS.line }}>
          <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold" style={{ background: TOKENS.blueprintDeep, color: TOKENS.paper }}>
            <span>{code.language ? code.language.toUpperCase() : 'SQL SCRIPT'}</span>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed" style={{ background: TOKENS.paper, color: TOKENS.ink }}>
            <code>{code.content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
