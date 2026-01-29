import { useState } from "react";

export default function AIContentGenerator({
  topic,
  type,
  onContentGenerated,
  id,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleGenerate = async (explicitKey = apiKey) => {
    setLoading(true);
    setError(null);

    try {
      const {
        generateGrammarLesson,
        generateSpeakingDrill,
        generateShadowingSession,
        generateRoleplayScenario,
      } = await import("../services/ai.js");

      let content;
      const keyToUse = explicitKey || "";

      if (type === "grammar") {
        content = await generateGrammarLesson(topic, keyToUse, id);
      } else if (type === "speaking") {
        content = await generateSpeakingDrill(topic, keyToUse, id);
      } else if (type === "shadowing") {
        content = await generateShadowingSession(topic, keyToUse, id);
      } else if (type === "roleplay") {
        content = await generateRoleplayScenario(topic, keyToUse, id);
      }

      onContentGenerated(content);
    } catch (err) {
      if (err.message && err.message.includes("Missing API Key")) {
        setShowKeyInput(true);
        setError("API Key required. The server doesn't have one configured.");
      } else {
        setError(err.message || "Failed to generate content");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto backdrop-blur-sm">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
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
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        Lesson content not ready yet
      </h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        This {type} lesson about "
        <span className="text-white font-medium">{topic}</span>" has not been
        created manually. You can generate it instantly using AI.
      </p>

      {showKeyInput && (
        <div className="mb-6 animate-fade-in text-left max-w-sm mx-auto">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            OpenAI API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter your key here if not configured on server.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => handleGenerate(apiKey)}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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
            Generating...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            {showKeyInput ? "Try with Key" : "Generate with AI"}
          </>
        )}
      </button>
    </div>
  );
}
