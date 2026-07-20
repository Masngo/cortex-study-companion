import React, { useEffect, useState } from 'react';
import { BookMarked, FolderOpen, Trash2 } from 'lucide-react';
import { TOKENS, TYPE_LABELS } from '../lib/tokens.js';
import { getStudyItems, deleteStudyItem } from '../lib/storage.js';

export default function SavedTab({ refreshKey, onOpen }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getStudyItems());
  }, [refreshKey]);

  const remove = (id, e) => {
    e.stopPropagation();
    deleteStudyItem(id);
    setItems(getStudyItems());
  };

  if (items.length === 0) {
    return (
      <div style={{ background: TOKENS.blueprint }} className="rounded-md p-6 text-center">
        <BookMarked size={22} color={TOKENS.gold} className="mx-auto mb-2" />
        <p style={{ color: '#ffffffaa' }} className="text-sm">Your Study Log portfolio is empty. Save generated maps from the Explore panel.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onOpen(item.diagram, item.topic)}
          style={{ background: TOKENS.paper }}
          className="rounded-md p-4 cursor-pointer transition-shadow hover:shadow-md flex flex-col justify-between group relative"
        >
          <div>
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <span style={{ background: TOKENS.ink + '10', color: TOKENS.inkSoft }} className="text-[9px] font-mono tracking-wide uppercase px-1.5 py-0.5 rounded-sm">
                {TYPE_LABELS[item.diagram.type] || item.diagram.type}
              </span>
              <button
                onClick={(e) => remove(item.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-sm text-black/30 hover:text-red-500 hover:bg-red-50 transition-all outline-none"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <h4 style={{ fontFamily: "'Fraunces', serif", color: TOKENS.ink }} className="font-semibold text-[14px] leading-snug mb-1">
              {item.title}
            </h4>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t" style={{ borderColor: '#0000000a' }}>
            <span style={{ color: TOKENS.inkSoft }} className="text-[10px] font-mono">
              {new Date(item.savedAt).toLocaleDateString()}
            </span>
            <span style={{ color: TOKENS.ink }} className="text-[11px] font-medium flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <FolderOpen size={11} /> Open
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
