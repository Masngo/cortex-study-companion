import React, { useState } from 'react';
import { Compass, FileCheck, Award, Share2, BarChart3, Bookmark, BrainCircuit, Download, Upload } from 'lucide-react';
import { TOKENS } from './lib/tokens.js';
import ExploreTab from './components/ExploreTab.jsx';
import ReviewTab from './components/ReviewTab.jsx';
import PracticeTab from './components/PracticeTab.jsx';
import ConnectionsTab from './components/ConnectionsTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import SavedTab from './components/SavedTab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);

  const tabs = [
    { id: 'explore', label: 'Explore Architecture', icon: Compass },
    { id: 'review', label: 'Audit Workspace', icon: FileCheck },
    { id: 'practice', label: 'Adaptive Testing', icon: Award },
    { id: 'connections', label: 'Cross-Domain Bridges', icon: Share2 },
    { id: 'dashboard', label: 'Performance Metrics', icon: BarChart3 },
    { id: 'saved', label: 'System Log Portfolio', icon: Bookmark },
  ];

  const handleOpenSaved = (diagram, topic) => {
    setCurrentDiagram(diagram);
    setCurrentTopic(topic);
    setActiveTab('explore');
  };

  const exportPortfolio = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('cortex_study_portfolio') || '[]');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "cortex_engineering_portfolio.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importPortfolio = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          localStorage.setItem('cortex_study_portfolio', JSON.stringify(parsed));
          setSavedRefreshKey(prev => prev + 1);
          alert("Portfolio architecture successfully injected!");
        }
      } catch (err) {
        alert("Invalid blueprint JSON payload file formatting.");
      }
    };
    if (e.target.files[0]) fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div style={{ background: TOKENS.blueprintDeep, minHeight: '100vh' }} className="text-white antialiased font-sans">
      <header style={{ background: '#00000020', borderBottom: `1px solid ${TOKENS.line}22` }} className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit size={22} color={TOKENS.gold} className="animate-pulse" />
          <h1 className="text-xl font-black tracking-wider">
            CORTEX <span style={{ color: TOKENS.gold, background: `${TOKENS.line}15` }} className="text-xs font-mono px-2 py-0.5 ml-1 rounded-sm border border-blue-400/20">PRO_MODE</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportPortfolio} style={{ color: TOKENS.paper }} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/40 transition-colors">
            <Download size={13} /> Export Portfolio
          </button>
          <label style={{ color: TOKENS.paper }} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/40 transition-colors cursor-pointer">
            <Upload size={13} /> Import Blueprint
            <input type="file" accept=".json" onChange={importPortfolio} className="hidden" />
          </label>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-1 md:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? `${TOKENS.line}25` : 'transparent',
                  color: isActive ? TOKENS.paper : '#ffffff88',
                  borderLeft: isActive ? `3px solid ${TOKENS.gold}` : '3px solid transparent'
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider rounded-r-md transition-all hover:bg-white/5 outline-none"
              >
                <Icon size={14} color={isActive ? TOKENS.gold : '#ffffff55'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <section className="md:col-span-3">
          {activeTab === 'explore' && (
            <ExploreTab 
              diagram={currentDiagram} 
              setDiagram={setCurrentDiagram}
              topic={currentTopic}
              setTopic={setCurrentTopic}
              onSaveSuccess={() => setSavedRefreshKey(prev => prev + 1)}
            />
          )}
          {activeTab === 'review' && <ReviewTab />}
          {activeTab === 'practice' && <PracticeTab diagram={currentDiagram} />}
          {activeTab === 'connections' && <ConnectionsTab />}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'saved' && (
            <SavedTab refreshKey={savedRefreshKey} onOpen={handleOpenSaved} />
          )}
        </section>
      </main>
    </div>
  );
}
