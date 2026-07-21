const STUDY_LOG_KEY = 'cortex_study_log_v1';
const PRACTICE_STATS_KEY = 'cortex_practice_stats_v1';

const INITIAL_MOCK_LOG = [
  {
    id: '1',
    title: 'Library System Database',
    topic: 'Library System Database',
    savedAt: new Date().toISOString(),
    diagram: {
      type: 'schema',
      nodes: [{ title: 'Books', details: ['isbn', 'title', 'author'] }, { title: 'Members', details: ['member_id', 'name'] }],
      edges: [{ from: 'Members', to: 'Books', label: 'loans' }],
      rationale: 'Relational schema optimized for tracking book checkouts and user records.',
      code: 'CREATE TABLE books (isbn VARCHAR(20) PRIMARY KEY, title VARCHAR(255));'
    }
  }
];

export function getStudyLog() {
  try {
<<<<<<< HEAD
    const data = localStorage.getItem(ITEMS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
=======
    const data = localStorage.getItem(STUDY_LOG_KEY);
    if (!data) {
      localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(INITIAL_MOCK_LOG));
      return INITIAL_MOCK_LOG;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_LOG;
  } catch (err) {
    console.error('Failed to load study log', err);
    return INITIAL_MOCK_LOG;
>>>>>>> eb93a25e71ba6e2fe9a18aef57715e3bb98754ff
  }
}

export const getStudyItems = getStudyLog;

export function saveToStudyLog(item) {
  try {
    const log = getStudyLog();
    const newItem = {
      id: item.id || Date.now().toString(),
      title: item.title || item.topic || 'Untitled Topic',
      topic: item.topic || item.title || 'Untitled Topic',
      savedAt: item.savedAt || new Date().toISOString(),
      diagram: item.diagram || item.data || item
    };
    const filtered = log.filter(entry => entry.title.toLowerCase() !== newItem.title.toLowerCase());
    const updated = [newItem, ...filtered];
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save to study log', err);
    return getStudyLog();
  }
}

<<<<<<< HEAD
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
=======
export const saveStudyItem = saveToStudyLog;

export function deleteFromStudyLog(id) {
  try {
    const log = getStudyLog();
    const updated = log.filter(item => item.id !== id);
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete item', err);
    return getStudyLog();
  }
}

export const deleteStudyItem = deleteFromStudyLog;

export function getPracticeStats() {
  try {
    const data = localStorage.getItem(PRACTICE_STATS_KEY);
    return data ? JSON.parse(data) : { correct: 3, incorrect: 1 };
  } catch (err) {
    return { correct: 3, incorrect: 1 };
  }
}

export function savePracticeStats(isCorrect) {
  try {
    const stats = getPracticeStats();
    const updated = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1)
    };
    localStorage.setItem(PRACTICE_STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getPracticeStats();
  }
}

export function getStats() {
  return getPracticeStats();
}
>>>>>>> eb93a25e71ba6e2fe9a18aef57715e3bb98754ff
