import React, { useState, useEffect } from 'react';
import { FolderOpen, Trash2 } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, deleteStudyItem } from '../lib/storage.js';

export default function SavedTab({ refreshKey, onOpen }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(getStudyItems());
  }, [refreshKey]);

  const remove = (id) => {
    deleteStudyItem(id);
    setSaved((prev) => prev.filter((e) => e.id !== id));
  };

  if (saved.length === 0) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <FolderOpen size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Nothing saved yet — build a diagram and hit "Save to Study Log."</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {saved.map((entry) => (
        <div key={entry.id} style={{ background: TOKENS.paper }} className="rounded-md p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }} className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm">
                {TYPE_LABELS[entry.diagram.type] || entry.diagram.type}
              </span>
              <p style={{ color: TOKENS.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold text-sm">{entry.title}</p>
            </div>
            <p style={{ color: TOKENS.inkSoft }} className="text-[11px] mt-1">{entry.diagram.nodes.length} nodes · saved {new Date(entry.savedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onOpen(entry.diagram, entry.topic)}
              style={{ background: TOKENS.ink, color: TOKENS.paper }}
              className="text-[12px] font-medium px-3 py-1.5 rounded-sm"
            >
              Open
            </button>
            <button
              onClick={() => remove(entry.id)}
              style={{ color: TOKENS.issue }}
              className="text-[12px] font-medium px-2 py-1.5 rounded-sm flex items-center gap-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
