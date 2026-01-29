import { useState, useEffect } from "react";
import { getDueWords, processReview } from "../utils/vocabularyStore";

export default function VocabularyReview() {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const words = getDueWords();
    setDueWords(words);
  }, []);

  const currentWord = dueWords[currentIndex];

  const handleRate = (quality) => {
    processReview(currentWord.id, quality);

    if (currentIndex < dueWords.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    } else {
      setSessionComplete(true);
    }
  };

  if (dueWords.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-4">All caught up!</h2>
        <p className="text-gray-400 mb-8">No words due for review today.</p>
        <a
          href="/"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-6">🧠</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Session Complete!
        </h2>
        <p className="text-gray-400 mb-8">
          You've reviewed {dueWords.length} words today.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8 text-sm text-gray-500 font-mono">
        <span>REVIEW SESSION</span>
        <span>
          {currentIndex + 1} / {dueWords.length}
        </span>
      </div>

      <div
        className="relative w-full aspect-[4/3] group perspective-1000 mb-8 cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? "rotate-y-180" : ""}`}
        >
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-2xl">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4">
              Word
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              {currentWord.word}
            </h2>
            <p className="absolute bottom-8 text-gray-500 text-sm animate-pulse">
              Tap to flip
            </p>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white text-gray-900 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-2xl overflow-y-auto">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
              Meaning
            </span>
            <p className="text-xl font-medium mb-6">
              {currentWord.definition || currentWord.word}
            </p>

            {currentWord.context && (
              <div className="bg-gray-100 p-4 rounded-xl w-full">
                <span className="text-xs font-bold text-gray-500 block mb-1 uppercase">
                  Context
                </span>
                <p className="text-gray-700 italic">"{currentWord.context}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFlipped ? (
        <div className="grid grid-cols-4 gap-3 animate-fade-in-up">
          <button
            onClick={() => handleRate(1)}
            className="py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-colors flex flex-col items-center gap-1"
          >
            <span>Again</span>
            <span className="text-[10px] opacity-70 font-normal">
              &lt; 1 min
            </span>
          </button>
          <button
            onClick={() => handleRate(3)}
            className="py-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-colors flex flex-col items-center gap-1"
          >
            <span>Hard</span>
            <span className="text-[10px] opacity-70 font-normal">2 days</span>
          </button>
          <button
            onClick={() => handleRate(4)}
            className="py-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-500 hover:text-white transition-colors flex flex-col items-center gap-1"
          >
            <span>Good</span>
            <span className="text-[10px] opacity-70 font-normal">4 days</span>
          </button>
          <button
            onClick={() => handleRate(5)}
            className="py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold hover:bg-green-500 hover:text-white transition-colors flex flex-col items-center gap-1"
          >
            <span>Easy</span>
            <span className="text-[10px] opacity-70 font-normal">7 days</span>
          </button>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center">
          {/* Placeholder to prevent layout shift */}
        </div>
      )}
    </div>
  );
}
