import { useState } from "react";

export default function WritingExercise({ lessonId, lessonTitle }) {
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!userText.trim()) return;
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const { generateWritingFeedback } = await import("../services/ai.js");
      const result = await generateWritingFeedback(lessonTitle, userText, "");
      setFeedback(result);

      if (result.score) {
        const currentStore = JSON.parse(
          localStorage.getItem("english-app-progress") ||
            '{"completedLessons":[], "scores":{}}',
        );
        if (!currentStore.completedLessons.includes(lessonId)) {
          currentStore.completedLessons.push(lessonId);
        }
        currentStore.scores[lessonId] = result.score;
        localStorage.setItem(
          "english-app-progress",
          JSON.stringify(currentStore),
        );
        window.dispatchEvent(new Event("progress-updated"));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <header className="text-center space-y-4">
        <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold tracking-wide uppercase">
          Writing Practice
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {lessonTitle}
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Write a short text about the topic above. The AI will correct your
          grammar and suggest better vocabulary.
        </p>
      </header>

      {!feedback ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Start writing here..."
            className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-6 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all resize-none text-lg leading-relaxed font-serif"
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleCheck}
              disabled={loading || !userText.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>Get Feedback</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-2">
                Assessment Score
              </h2>
              <div className="text-6xl font-black text-white mb-2">
                {feedback.score}
                <span className="text-2xl text-white/50">/10</span>
              </div>
              <p className="text-purple-200">{feedback.general_feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-pink-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </span>
                Corrections
              </h3>
              {feedback.corrections?.length > 0 ? (
                <div className="space-y-4">
                  {feedback.corrections.map((item, i) => (
                    <div
                      key={i}
                      className="bg-black/20 rounded-xl p-4 border border-white/5"
                    >
                      <div className="mb-2">
                        <span className="line-through text-red-400/70 mr-2">
                          {item.original}
                        </span>
                        <span className="text-green-400 font-bold">
                          {item.correction}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        "{item.explanation}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Great job! No major grammar errors found.
                </p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                Better Vocabulary
              </h3>
              {feedback.better_vocabulary?.length > 0 ? (
                <div className="space-y-4">
                  {feedback.better_vocabulary.map((item, i) => {
                    const [saved, setSaved] = useState(false);
                    return (
                      <div
                        key={i}
                        className="bg-black/20 rounded-xl p-4 border border-white/5 flex gap-4 items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 flex-wrap">
                            <span className="text-gray-400 line-through decoration-red-500/50">
                              {item.original}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                            <span className="text-blue-300 font-bold">
                              {item.suggestion}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.context}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            import("../utils/vocabularyStore").then(
                              ({ addWord }) => {
                                const success = addWord(
                                  item.suggestion,
                                  "Better alternative for: " + item.original,
                                  item.context,
                                );
                                if (success) setSaved(true);
                              },
                            );
                          }}
                          disabled={saved}
                          title={saved ? "Saved to bank" : "Save to Smart Bank"}
                          className={`p-2 rounded-lg transition-colors ${saved ? "text-green-400 bg-green-500/10" : "text-gray-500 hover:text-white hover:bg-white/10"}`}
                        >
                          {saved ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Your vocabulary usage is appropriate.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setFeedback(null);
              }}
              className="text-gray-400 hover:text-white underline transition-colors"
            >
              Write another draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
