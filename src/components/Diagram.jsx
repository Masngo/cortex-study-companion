import React, { useRef, useEffect, useState } from 'react';
import { TOKENS } from '../lib/tokens.js';

export default function Diagram({ diagram }) {
  const containerRef = useRef(null);
  const [nodePositions, setNodePositions] = useState({});

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !diagram?.nodes) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = {};

      diagram.nodes.forEach((node) => {
        if (!node) return;
        const el = document.getElementById(`node-${node.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          positions[node.id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        }
      });
      setNodePositions(positions);
    };

    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 150);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [diagram]);

  if (!diagram || !diagram.nodes) {
    return <div className="text-xs font-mono opacity-50 p-4">Invalid or missing structural nodes array framework.</div>;
  }

  const nodes = diagram.nodes || [];
  const edges = diagram.edges || [];

  return (
    <div 
      ref={containerRef} 
      style={{ background: TOKENS.blueprintDeep, borderColor: TOKENS.line + '33' }} 
      className="relative w-full rounded-md border p-6 min-h-[400px] overflow-hidden flex flex-wrap gap-6 justify-center items-start"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={TOKENS.line} opacity="0.6" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          if (!edge || !edge.from || !edge.to) return null;
          const fromPos = nodePositions[edge.from];
          const toPos = nodePositions[edge.to];
          if (!fromPos || !toPos) return null;

          return (
            <g key={i}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={TOKENS.line}
                strokeWidth="2"
                strokeDasharray={diagram.type === 'concept_map' ? '4 4' : '0'}
                opacity="0.5"
                markerEnd="url(#arrow)"
              />
              {edge.label && (
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 4}
                  fill="#ffffff88"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        if (!node) return null;
        return (
          <div
            key={node.id}
            id={`node-${node.id}`}
            style={{ 
              background: TOKENS.paper, 
              color: TOKENS.ink,
              borderLeft: `4px solid ${diagram.type === 'schema' ? TOKENS.gold : TOKENS.line}`
            }}
            className="relative z-10 w-64 rounded-sm shadow-xl p-3 text-xs flex flex-col space-y-2 transition-transform hover:scale-[1.01]"
          >
            <div className="font-bold tracking-tight border-b pb-1 flex justify-between items-center" style={{ borderColor: '#0000000a' }}>
              <span className="uppercase text-[11px] truncate">{node.label || 'Component'}</span>
              <span className="text-[9px] opacity-40 font-mono">#{node.id}</span>
            </div>
            <ul className="space-y-1 list-none pl-0 m-0 text-slate-700">
              {node.detail && node.detail.map((bullet, idx) => (
                <li key={idx} className="leading-relaxed flex items-start gap-1">
                  <span className="text-amber-500 font-bold select-none">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
