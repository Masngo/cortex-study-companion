const STUDY_LOG_KEY = 'cortex_study_log_v1';
const PRACTICE_STATS_KEY = 'cortex_practice_stats_v1';

export function getStudyLog() {
  try {
    const data = localStorage.getItem(STUDY_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load study log from localStorage', err);
    return [];
  }
}

export const getStudyItems = getStudyLog;

export function saveToStudyLog(item) {
  try {
    const log = getStudyLog();
    const newItem = {
      id: item.id || Date.now().toString(),
      topic: item.topic || 'Untitled Topic',
      timestamp: item.timestamp || new Date().toISOString(),
      data: item.data || item
    };
    const filtered = log.filter(entry => entry.topic.toLowerCase() !== newItem.topic.toLowerCase());
    const updated = [newItem, ...filtered];
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save to study log', err);
    return getStudyLog();
  }
}

export const saveStudyItem = saveToStudyLog;

export function deleteFromStudyLog(id) {
  try {
    const log = getStudyLog();
    const updated = log.filter(item => item.id !== id);
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete item from study log', err);
    return getStudyLog();
  }
}

export const deleteStudyItem = deleteFromStudyLog;

export function getPracticeStats() {
  try {
    const data = localStorage.getItem(PRACTICE_STATS_KEY);
    return data ? JSON.parse(data) : { correct: 0, incorrect: 0, total: 0 };
  } catch (err) {
    console.error('Failed to load practice stats', err);
    return { correct: 0, incorrect: 0, total: 0 };
  }
}

export function savePracticeStats(isCorrect) {
  try {
    const stats = getPracticeStats();
    const updated = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1),
      total: stats.total + 1
    };
    localStorage.setItem(PRACTICE_STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save practice stats', err);
    return getPracticeStats();
  }
}

export function getStats() {
  const items = getStudyLog();
  const practice = getPracticeStats();
  return {
    totalStudied: items.length,
    practiceStats: practice,
    streak: items.length > 0 ? 1 : 0
  };
}
