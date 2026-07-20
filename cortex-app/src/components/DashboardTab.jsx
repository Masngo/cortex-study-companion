import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, BookMarked, Target, Flame } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, getStats } from '../lib/storage.js';

function StatCard({ icon, label, value }) {
  return (
    <div style={{ background: TOKENS.blueprintDeep }} className="rounded-md p-4 flex items-center gap-3 flex-1 min-w-[140px]">
      <div style={{ background: TOKENS.gold + '22', color: TOKENS.gold }} className="p-2 rounded-sm">
        {icon}
      </div>
      <div>
        <p style={{ color: '#ffffff99' }} className="text-[11px] uppercase tracking-wide">{label}</p>
        <p style={{ color: TOKENS.paper, fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardTab({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setItems(getStudyItems());
    setStats(getStats());
  }, [refreshKey]);

  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : null;

  const typeColors = {
    schema: TOKENS.gold,
    process: TOKENS.rust,
    architecture: TOKENS.line,
    concept_map: TOKENS.good,
  };

  const chartData = Object.keys(TYPE_LABELS).map((key) => ({
    name: TYPE_LABELS[key],
    count: items.filter((i) => i.diagram.type === key).length,
    key,
  }));

  return (
    <div>
      <div className="flex gap-3 flex-wrap mb-6">
        <StatCard icon={<BookMarked size={18} />} label="Topics studied" value={items.length} />
        <StatCard icon={<Target size={18} />} label="Practice accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
        <StatCard icon={<Flame size={18} />} label="Questions answered" value={total} />
      </div>

      {items.length === 0 ? (
        <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
          <LayoutDashboard size={22} color={TOKENS.gold} className="mx-auto mb-2" />
          <p style={{ color: '#ffffffaa' }} className="text-sm">Explore a few topics to start seeing your study patterns here.</p>
        </div>
      ) : (
        <>
          <div style={{ background: TOKENS.paper }} className="rounded-md p-5">
            <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold mb-4">Topics by type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: TOKENS.inkSoft }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: TOKENS.inkSoft }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#00000008' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={typeColors[entry.key]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: TOKENS.paper }} className="rounded-md p-5 mt-4">
            <h3 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold mb-3">Recent activity</h3>
            <div className="space-y-2">
              {items.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: '#00000010' }}>
                  <span style={{ color: TOKENS.ink }}>{entry.title}</span>
                  <span style={{ color: TOKENS.inkSoft }} className="text-[11px] font-mono">{new Date(entry.savedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
