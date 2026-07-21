const ITEMS_KEY = 'cortex_study_items';
const STATS_KEY = 'cortex_practice_stats';

export function getStudyItems() {
  try {
    const data = localStorage.getItem(ITEMS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
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
  const items = getStudyItems().filter((i) => i && i.id !== id);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function getStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    const parsed = data ? JSON.parse(data) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        correct: typeof parsed.correct === 'number' ? parsed.correct : 0,
        incorrect: typeof parsed.incorrect === 'number' ? parsed.incorrect : 0,
      };
    }
    return { correct: 0, incorrect: 0 };
  } catch (e) {
    return { correct: 0, incorrect: 0 };
  }
}

export function recordAnswer(result) {
  const stats = getStats();
  const key = result === 'correct' ? 'correct' : 'incorrect';
  const next = { ...stats, [key]: stats[key] + 1 };
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}