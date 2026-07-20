import React, { useEffect, useState } from 'react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, getStats } from '../lib/storage.js';
import { Target, Library, Activity, BarChart2 } from 'lucide-react';

export default function DashboardTab() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setItems(getStudyItems());
    setStats(getStats());
  }, []);

  const distribution = items.reduce((acc, current) => {
    const type = current.diagram?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = stats.correct + stats.incorrect;
  const rawAccuracy = totalReviews > 0 ? (stats.correct / totalReviews) * 100 : 0;
  
  const chartData = Object.entries(TYPE_LABELS).map(([key, label]) => ({
    label,
    count: distribution[key] || 0
  }));

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 flex items-center gap-3">
          <div className="p-2 rounded-sm bg-white/10 text-amber-400"><Library size={18} /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{items.length}</div>
            <div className="text-[11px] opacity-60 uppercase tracking-wider">Saved Concept Models</div>
          </div>
        </div>

        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 flex items-center gap-3">
          <div className="p-2 rounded-sm bg-white/10 text-emerald-400"><Target size={18} /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{rawAccuracy.toFixed(0)}%</div>
            <div className="text-[11px] opacity-60 uppercase tracking-wider">Practice Verification</div>
          </div>
        </div>

        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-4 flex items-center gap-3">
          <div className="p-2 rounded-sm bg-white/10 text-blue-400"><Activity size={18} /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{totalReviews}</div>
            <div className="text-[11px] opacity-60 uppercase tracking-wider">Traced Questions</div>
          </div>
        </div>
      </div>

      <div style={{ background: TOKENS.paper, color: TOKENS.ink }} className="rounded-md p-5 shadow-xl">
        <div className="flex items-center gap-1.5 mb-4 border-b pb-2" style={{ borderColor: '#0000000a' }}>
          <BarChart2 size={15} color={TOKENS.blueprint} />
          <h4 style={{ fontFamily: "'Fraunces', serif" }} className="font-semibold text-sm text-slate-800">
            Topology Layout Distribution Analysis
          </h4>
        </div>

        <div className="space-y-3.5">
          {chartData.map((bar, i) => {
            const pct = (bar.count / maxCount) * 100;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                  <span>{bar.label}</span>
                  <span className="font-mono text-slate-400">{bar.count} saved</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    style={{ 
                      width: `${pct}%`, 
                      background: i % 2 === 0 ? TOKENS.blueprint : TOKENS.gold 
                    }} 
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
