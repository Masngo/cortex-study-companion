import React, { useState } from 'react';
import { TOKENS } from '../lib/tokens.js';
import { Network } from 'lucide-react';

function FormattedText({ content }) {
  if (!content) return null;

  const sections = content.split(/\n{2,}|---/).filter(Boolean);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const trimmed = section.trim();

        if (trimmed.startsWith('#')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <h3 key={idx} className="text-lg font-bold border-b pb-1 mt-2" style={{ color: TOKENS.ink, borderColor: TOKENS.line + '33' }}>
              {headingText}
            </h3>
          );
        }

        const lines = trimmed.split('\n');

        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              const formattedLine = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} style={{ color: TOKENS.ink }}>
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              });

              return (
                <p key={lIdx} className="text-sm leading-relaxed" style={{ color: TOKENS.inkSoft }}>
                  {formattedLine}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ConnectionsTab({ studyLog = [] }) {
  // Default topics to populate dropdowns even when studyLog is empty
  const defaultTopics = [
    "TCP 3-Way Handshake Protocol",
    "Photosynthesis and Water Cycle",
    "Random Forest Crop Yield Prediction",
    "Hospital Management Relational Database",
    "OAuth 2.0 Authentication Flow"
  ];

  // Merge study log titles with defaults to ensure dropdown is never empty
  const availableTopics = studyLog.length > 0 
    ? studyLog.map((item) => item.title || item.topic || String(item)) 
    : defaultTopics;

  const [topicA, setTopicA] = useState(availableTopics[0] || '');
  const [topicB, setTopicB] = useState(availableTopics[1] || availableTopics[0] || '');
  const [connectionText, setConnectionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!topicA.trim() || !topicB.trim()) return;
    setLoading(true);
    setError('');
    setConnectionText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'Compare two topics studied by the user. Highlight conceptual connections, differences, and practical takeaways.',
          prompt: `Compare "${topicA}" and "${topicB}".`,
        }),
      });

      const data = await response.json();
      let textContent = '';

      try {
        const parsed = JSON.parse(data.text);
        textContent = parsed.connection || parsed.summary || parsed.text || data.text;
      } catch {
        textContent = data.text;
      }

      setConnectionText(textContent);
    } catch (err) {
      console.error(err);
      setError("Couldn't generate comparison — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Network size={20} color={TOKENS.gold} />
        <h2 className="text-lg font-bold" style={{ color: TOKENS.paper }}>
          Compare two things you've studied
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] space-y-1">
          <input
            type="text"
            value={topicA}
            onChange={(e) => setTopicA(e.target.value)}
            placeholder="Type or select first topic..."
            className="w-full p-2.5 rounded-md border text-sm font-medium"
            style={{ background: TOKENS.paper, color: TOKENS.ink, borderColor: TOKENS.line }}
          />
          <select
            onChange={(e) => setTopicA(e.target.value)}
            className="w-full p-1.5 rounded text-xs font-medium opacity-80"
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
          >
            <option value="">-- Choose from saved/suggested topics --</option>
            {availableTopics.map((t, idx) => (
              <option key={idx} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <span className="text-sm font-semibold pt-1" style={{ color: TOKENS.paper }}>
          and
        </span>

        <div className="flex-1 min-w-[240px] space-y-1">
          <input
            type="text"
            value={topicB}
            onChange={(e) => setTopicB(e.target.value)}
            placeholder="Type or select second topic..."
            className="w-full p-2.5 rounded-md border text-sm font-medium"
            style={{ background: TOKENS.paper, color: TOKENS.ink, borderColor: TOKENS.line }}
          />
          <select
            onChange={(e) => setTopicB(e.target.value)}
            className="w-full p-1.5 rounded text-xs font-medium opacity-80"
            style={{ background: TOKENS.paper, color: TOKENS.ink }}
          >
            <option value="">-- Choose from saved/suggested topics --</option>
            {availableTopics.map((t, idx) => (
              <option key={idx} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
        className="px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
      >
        <Network size={16} />
        {loading ? 'Analyzing Connection...' : 'Explain the connection'}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {connectionText && (
        <div
          style={{ background: TOKENS.paper, borderColor: TOKENS.line }}
          className="p-6 rounded-md border shadow-md mt-4"
        >
          <FormattedText content={connectionText} />
        </div>
      )}
    </div>
  );
}
