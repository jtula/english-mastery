export const STORAGE_KEY = "english_app_progress";

export const getProgress = () => {
  if (typeof window === "undefined")
    return { completedLessons: [], scores: {} };
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { completedLessons: [], scores: {} };
};

export const saveProgress = (lessonId, score = null) => {
  const progress = getProgress();

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  if (score !== null) {
    const currentScore = progress.scores[lessonId] || 0;
    if (score > currentScore) {
      progress.scores[lessonId] = score;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  window.dispatchEvent(new Event("progress-updated"));
};

export const isLessonCompleted = (lessonId) => {
  const { completedLessons } = getProgress();
  return completedLessons.includes(lessonId);
};

export const getLessonScore = (lessonId) => {
  const { scores } = getProgress();
  return scores[lessonId] || 0;
};
