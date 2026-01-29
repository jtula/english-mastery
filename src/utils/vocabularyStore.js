/**
 * Vocabulary Store with Spaced Repetition System (SRS)
 * Algorithm: Simplified SuperMemo-2 (SM-2)
 * Storage Key: 'english-app-vocabulary'
 */

const STORAGE_KEY = "english-app-vocabulary";

const getToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function getWords() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWords(words) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  window.dispatchEvent(new Event("vocabulary-updated"));
}

export function addWord(word, definition, context, suggestedBy = "AI") {
  const words = getWords();

  if (words.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
    return false;
  }

  const newWord = {
    id: `word-${Date.now()}`,
    word,
    definition,
    context,
    suggestedBy,
    addedAt: Date.now(),

    // SRS State (SM-2 defaults)
    reps: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: getToday(),
  };

  words.push(newWord);
  saveWords(words);
  return true;
}

export function getDueWords() {
  const words = getWords();
  const today = getToday();
  return words.filter((w) => w.nextReview <= today);
}

/**
 * Process a review for a word
 * @param {string} id - Word ID
 * @param {number} quality - 0 to 5 rating (We usually map UI: Again=1, Hard=3, Good=4, Easy=5)
 * Reference: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */
export function processReview(id, quality) {
  const words = getWords();
  const index = words.findIndex((w) => w.id === id);
  if (index === -1) return;

  let word = words[index];

  // 1. Update Ease Factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // q is quality (0-5)
  // If q < 3, we don't update repetition count effectively (it resets)

  let newEf =
    word.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEf < 1.3) newEf = 1.3;

  // 2. Update Repetitions & Interval
  if (quality >= 3) {
    if (word.reps === 0) {
      word.interval = 1;
    } else if (word.reps === 1) {
      word.interval = 6;
    } else {
      word.interval = Math.round(word.interval * word.easeFactor);
    }
    word.reps += 1;
  } else {
    // Variable quality < 3 means failed/forgot
    word.reps = 0;
    word.interval = 1; // Start over -> review tomorrow
  }

  word.easeFactor = newEf;

  // 3. Set Next Review Date
  const nextDate = new Date();
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + word.interval);
  word.nextReview = nextDate.getTime();

  // 4. Save
  words[index] = word;
  saveWords(words);
}

export function getReviewStats() {
  const words = getWords();
  const due = getDueWords().length;
  const total = words.length;
  const learned = words.filter((w) => w.reps > 3).length; // Arbitrary threshold for "learned"
  return { due, total, learned };
}
