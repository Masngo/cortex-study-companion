const ITEMS_KEY = 'cortex_study_items';
const STATS_KEY = 'cortex_practice_stats';

export function getStudyItems() {
  try {
    return JSON.parse(localStorage.getItem(ITEMS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveStudyItem(entry) {
  const items = getStudyItems();
  items.unshift(entry);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  return true;
}

export function deleteStudyItem(id) {
  const items = getStudyItems().filter((i) => i.id !== id);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{"correct":0,"incorrect":0}');
  } catch (e) {
    return { correct: 0, incorrect: 0 };
  }
}

export function recordAnswer(result) {
  const stats = getStats();
  const next = { ...stats, [result === 'correct' ? 'correct' : 'incorrect']: stats[result === 'correct' ? 'correct' : 'incorrect'] + 1 };
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}
