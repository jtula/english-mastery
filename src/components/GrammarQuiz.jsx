import { useState } from "react";

import { saveProgress } from "../utils/progressStore";

export default function GrammarQuiz({ quizzes, lessonId }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = quizzes[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    setShowExplanation(true);
    if (selectedOption === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      if (lessonId) {
        saveProgress(lessonId, score);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h3>
        <p className="text-gray-300 text-lg mb-6">
          You scored <span className="text-indigo-400 font-bold">{score}</span>{" "}
          out of <span className="text-white">{quizzes.length}</span>
        </p>
        <button
          onClick={resetQuiz}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const progress = (currentQuestionIndex / quizzes.length) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
        <span>
          Question {currentQuestionIndex + 1} of {quizzes.length}
        </span>
        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-8">
        {currentQuestion.question.replace("___", "_____")}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={showExplanation}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedOption === option
                ? showExplanation
                  ? option === currentQuestion.correct
                    ? "bg-green-500/20 border-green-500 text-green-200"
                    : "bg-red-500/20 border-red-500 text-red-200"
                  : "bg-indigo-500/20 border-indigo-500 text-white"
                : showExplanation && option === currentQuestion.correct
                  ? "bg-green-500/20 border-green-500 text-green-200"
                  : "bg-black/20 border-white/5 hover:bg-white/5 text-gray-300 hover:border-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div
          className={`p-4 rounded-xl mb-6 ${selectedOption === currentQuestion.correct ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
        >
          <p className="text-sm font-semibold mb-1 text-gray-200">
            {selectedOption === currentQuestion.correct
              ? "Correct!"
              : "Incorrect"}
          </p>
          <p className="text-sm text-gray-400">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
