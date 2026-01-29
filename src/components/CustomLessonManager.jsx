import { useState } from "react";
import { suggestTopics } from "../services/ai";
import { addCustomModule } from "../utils/customModuleStore";

export default function CustomLessonManager({ level, onClose }) {
  const [step, setStep] = useState(1);
  const [activityType, setActivityType] = useState("speaking");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const topics = await suggestTopics(level, activityType, "");
      setSuggestions(topics);
      setStep(2);
    } catch (err) {
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const topic = selectedTopic === "custom" ? customTopic : selectedTopic;
    if (!topic) return;
    setLoading(true);

    const newModule = {
      id: `custom-${activityType}-${Date.now()}`,
      title: topic,
      type: activityType,
      isCustom: true,
    };

    try {
      await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModule),
      });
    } catch (e) {
      console.error("Failed to sync with DB:", e);
    }

    addCustomModule(level, newModule);

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          Create New Activity
        </h2>
        <p className="text-gray-400 mb-6">
          Level: <span className="text-indigo-400 font-bold">{level}</span>
        </p>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                What kind of practice?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "grammar",
                  "speaking",
                  "shadowing",
                  "roleplay",
                  "writing",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActivityType(type)}
                    className={`p-3 rounded-xl border text-left capitalize transition-all ${
                      activityType === type
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGetSuggestions}
              disabled={loading}
              className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? "Thinking..." : "Suggest Topics with AI"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Choose a topic or write your own:
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {suggestions.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                      selectedTopic === topic
                        ? "bg-green-500/20 border-green-500 text-white"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
                <div className="pt-2 border-t border-white/10 mt-2">
                  <input
                    type="text"
                    placeholder="Or type your own topic..."
                    className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-colors"
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      setSelectedTopic("custom");
                    }}
                    onClick={() => setSelectedTopic("custom")}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={
                  !selectedTopic ||
                  (selectedTopic === "custom" && !customTopic.trim())
                }
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Create Activity
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
