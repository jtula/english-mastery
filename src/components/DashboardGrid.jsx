import { useEffect, useState } from "react";
import { getProgress } from "../utils/progressStore";
import {
  getCustomModules,
  deleteCustomModule,
} from "../utils/customModuleStore";
import { getReviewStats } from "../utils/vocabularyStore";
import CustomLessonManager from "./CustomLessonManager.jsx";

export default function DashboardGrid({ curriculum }) {
  const [progress, setProgress] = useState({
    completedLessons: [],
    scores: {},
  });
  const [customModules, setCustomModules] = useState({});
  const [reviewStats, setReviewStats] = useState({ due: 0, total: 0 });
  const [isClient, setIsClient] = useState(false);
  const [creatingForLevel, setCreatingForLevel] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const handleUpdate = () => {
      setProgress(getProgress());
      setCustomModules(getCustomModules());
      setReviewStats(getReviewStats());
    };
    handleUpdate();

    window.addEventListener("progress-updated", handleUpdate);
    window.addEventListener("custom-modules-updated", handleUpdate);
    window.addEventListener("vocabulary-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("progress-updated", handleUpdate);
      window.removeEventListener("custom-modules-updated", handleUpdate);
      window.removeEventListener("vocabulary-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const isCompleted = (id) => progress.completedLessons.includes(id);

  return (
    <div className="space-y-16 animate-fade-in">
      {reviewStats.total > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
              🧠
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Daily Vocabulary Review
              </h2>
              <p className="text-indigo-200">
                {reviewStats.due > 0
                  ? `You have ${reviewStats.due} words to review today.`
                  : "All caught up! Great memory."}
              </p>
            </div>
          </div>
          <a
            href="/review"
            className={`relative z-10 px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${reviewStats.due > 0
                ? "bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105"
                : "bg-white/10 text-white cursor-default opacity-50"
              }`}
          >
            {reviewStats.due > 0 ? "Start Review" : "Review Completed"}
            {reviewStats.due > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            )}
          </a>
        </div>
      )}

      {curriculum.map((level) => {
        const standardModules = level.modules || [];
        const userModules = customModules[level.level] || [];
        const allModules = [...standardModules, ...userModules];

        return (
          <section key={level.level} className="relative">
            <div className="flex items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div className="flex items-end gap-4">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                  {level.level}
                </h2>
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {level.title}
                  </h3>
                  <p className="text-sm text-gray-400">{level.description}</p>
                </div>
              </div>
              <button
                onClick={() => setCreatingForLevel(level.level)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
                New Activity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allModules.map((module) => {
                const done = isCompleted(module.id);
                let href = "#";
                let colorClass = "gray";
                let typeLabel = "Lesson";

                if (module.type === "grammar") {
                  href = `/grammar/${module.id}`;
                  colorClass = "indigo";
                  typeLabel = "Grammar";
                } else if (module.type === "speaking") {
                  href = `/speaking/${module.id}`;
                  colorClass = "pink";
                  typeLabel = "Speaking";
                } else if (module.type === "shadowing") {
                  href = `/shadowing/${module.id}`;
                  colorClass = "cyan";
                  typeLabel = "Shadowing";
                } else if (module.type === "roleplay") {
                  href = `/roleplay/${module.id}`;
                  colorClass = "orange";
                  typeLabel = "Roleplay";
                } else if (module.type === "writing") {
                  href = `/writing/${module.id}`;
                  colorClass = "purple";
                  typeLabel = "Writing";
                } else if (module.type === "structured-writing") {
                  href = `/structured-writing/${module.id}`;
                  colorClass = "teal";
                  typeLabel = "Structured";
                }

                return (
                  <div key={module.id} className="relative group">
                    <a
                      href={href}
                      className={`block h-full relative border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${done
                          ? `bg-${colorClass}-500/10 border-${colorClass}-500/30 shadow-${colorClass}-500/10`
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-indigo-500/10"
                        }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-${colorClass}-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                      ></div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold tracking-wide rounded-full ${done
                                ? "bg-green-500/20 text-green-300"
                                : `bg-${colorClass}-500/20 text-${colorClass}-300`
                              }`}
                          >
                            {done ? "Completed" : typeLabel}
                          </span>
                          {done && (
                            <span className="text-green-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          Click to start practice.
                        </p>
                      </div>
                    </a>
                    {/* Delete button for custom modules */}
                    {module.isCustom && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm("Delete this custom activity?")) {
                            deleteCustomModule(level.level, module.id);
                          }
                        }}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors z-20 p-1"
                        title="Delete Activity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {creatingForLevel && (
        <CustomLessonManager
          level={creatingForLevel}
          onClose={() => setCreatingForLevel(null)}
        />
      )}
    </div>
  );
}
