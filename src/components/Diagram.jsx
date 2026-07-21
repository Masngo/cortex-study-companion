import React, { useRef, useState, useLayoutEffect } from 'react';
import { Brain } from 'lucide-react';
import { TOKENS } from '../lib/tokens.js';

function NodeCard({ node, cardRef }) {
  if (!node) return null;

  // Safely extract detail array (handles array, string, or fallback properties)
  const details = Array.isArray(node.detail)
    ? node.detail
    : Array.isArray(node.details)
    ? node.details
    : typeof node.detail === 'string'
    ? [node.detail]
    : [];

  return (
    <div
      ref={cardRef}
      style={{ background: TOKENS.paper, borderColor: TOKENS.line + '55' }}
      className="rounded-md border-2 w-64 shadow-lg flex-shrink-0"
    >
      <div style={{ background: TOKENS.ink }} className="px-3 py-2 rounded-t-sm flex items-center gap-1.5">
        <Brain size={13} color={TOKENS.gold} />
        <span style={{ color: TOKENS.paper, fontFamily: "'JetBrains Mono', monospace" }} className="text-[13px] font-semibold">
          {node.label || node.title || node.id || 'Untitled Node'}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">
        {details.length > 0 ? (
          details.map((d, i) => (
            <p key={i} style={{ color: TOKENS.ink, fontFamily: "'JetBrains Mono', monospace" }} className="text-[12px] leading-snug">
              {typeof d === 'object' ? JSON.stringify(d) : String(d)}
            </p>
          ))
        ) : (
          <p style={{ color: TOKENS.ink + 'aa', fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] italic">
            No details provided
          </p>
        )}
      </div>
    </div>
  );
}

export default function Diagram({ diagram }) {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [lines, setLines] = useState([]);

  // Safely extract top-level nodes array to prevent runtime crashes
  const nodes = Array.isArray(diagram?.nodes) ? diagram.nodes : [];

  useLayoutEffect(() => {
    if (!diagram) return;
    const compute = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const newLines = (diagram.edges || [])
        .map((e) => {
          const fromEl = cardRefs.current[e.from];
          const toEl = cardRefs.current[e.to];
          if (!fromEl || !toEl) return null;
          const fr = fromEl.getBoundingClientRect();
          const tr = toEl.getBoundingClientRect();
          const x1 = fr.left + fr.width / 2 - containerRect.left;
          const y1 = fr.top + fr.height / 2 - containerRect.top;
          const x2 = tr.left + tr.width / 2 - containerRect.left;
          const y2 = tr.top + tr.height / 2 - containerRect.top;
          return { key: e.from + '-' + e.to, x1, y1, x2, y2, label: e.label, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
        })
        .filter(Boolean);
      setLines(newLines);
    };
    const t = setTimeout(compute, 30);
    window.addEventListener('resize', compute);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', compute);
    };
  }, [diagram]);

  return (
    <div
      ref={containerRef}
      style={{
        background: TOKENS.blueprintDeep,
        backgroundImage: `radial-gradient(${TOKENS.line}22 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      }}
      className="relative rounded-md p-6 overflow-auto"
    >
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {lines.map((l) => (
          <g key={l.key}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={TOKENS.line} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            <circle cx={l.x1} cy={l.y1} r="3" fill={TOKENS.line} />
            <circle cx={l.x2} cy={l.y2} r="3" fill={TOKENS.line} />
            {l.label && (
              <text x={l.mx} y={l.my - 4} fill={TOKENS.gold} fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
                {l.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-8 relative" style={{ zIndex: 1 }}>
        {nodes.map((n) => (
          <NodeCard key={n.id} node={n} cardRef={(el) => (cardRefs.current[n.id] = el)} />
        ))}
      </div>
    </div>
  );
}