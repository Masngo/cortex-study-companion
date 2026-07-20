import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { TOKENS } from './lib/tokens.js';
import ExploreTab from './components/ExploreTab.jsx';
import ReviewTab from './components/ReviewTab.jsx';
import PracticeTab from './components/PracticeTab.jsx';
import SavedTab from './components/SavedTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import ConnectionsTab from './components/ConnectionsTab.jsx';

const TABS = [
  ['explore', 'Explore a topic'],
  ['review', 'Review my work'],
  ['practice', 'Practice'],
  ['connections', 'Connections'],
  ['dashboard', 'Dashboard'],
  ['saved', 'Study log'],
];

export default function App() {
  const [tab, setTab] = useState('explore');
  const [diagram, setDiagram] = useState(null);
  const [topic, setTopic] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const openSaved = (savedDiagram, savedTopic) => {
    setDiagram(savedDiagram);
    setTopic(savedTopic || '');
    setTab('explore');
  };

  return (
    <div style={{ background: TOKENS.blueprint, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }} className="p-5 sm:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
      `}</style>

      <div className="flex items-center gap-2 mb-1">
        <div style={{ background: TOKENS.gold }} className="p-2 rounded-sm">
          <Brain size={20} color={TOKENS.blueprintDeep} />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.paper }} className="text-xl font-semibold leading-tight">
            Cortex
          </h1>
          <p style={{ color: '#ffffff77' }} className="text-[12px]">An AI study companion — turn any topic into a diagram, an explanation, and practice</p>
        </div>
      </div>

      <div className="flex gap-1 mt-6 mb-5 flex-wrap">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: tab === key ? TOKENS.paper : 'transparent',
              color: tab === key ? TOKENS.ink : '#ffffffaa',
            }}
            className="px-4 py-1.5 rounded-sm text-sm font-medium"
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'explore' && (
        <ExploreTab
          diagram={diagram}
          setDiagram={setDiagram}
          topic={topic}
          setTopic={setTopic}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
      {tab === 'review' && <ReviewTab />}
      {tab === 'practice' && <PracticeTab diagram={diagram} />}
      {tab === 'connections' && <ConnectionsTab refreshKey={refreshKey} />}
      {tab === 'dashboard' && <DashboardTab refreshKey={refreshKey} />}
      {tab === 'saved' && <SavedTab refreshKey={refreshKey} onOpen={openSaved} />}
    </div>
  );
}
