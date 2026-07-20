const ITEMS_KEY = 'cortex_study_portfolio';
const STATS_KEY = 'cortex_practice_tracker';

export function getStudyItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStudyItem(entry) {
  try {
    const current = getStudyItems();
    localStorage.setItem(ITEMS_KEY, JSON.stringify([entry, ...current]));
  } catch (e) {
    console.error('Failed persistence save', e);
  }
}

export function deleteStudyItem(id) {
  try {
    const current = getStudyItems();
    localStorage.setItem(ITEMS_KEY, JSON.stringify(current.filter(i => i.id !== id)));
  } catch (e) {
    console.error('Failed deletion', e);
  }
}

export function getStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { correct: 0, incorrect: 0 };
  } catch (e) {
    return { correct: 0, incorrect: 0 };
  }
}

export function updateStats(isCorrect) {
  try {
    const current = getStats();
    if (isCorrect) current.correct += 1;
    else current.incorrect += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed profile incremental update', e);
  }
}
