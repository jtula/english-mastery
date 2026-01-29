import { useState } from "react";
import GrammarQuiz from "./GrammarQuiz.jsx";
import AIContentGenerator from "./AIContentGenerator.jsx";
import { marked } from "marked";

export default function GrammarLesson({
  initialLesson,
  lessonId,
  lessonTitle,
}) {
  const [lesson, setLesson] = useState(initialLesson);

  if (!lesson) {
    return (
      <AIContentGenerator
        topic={lessonTitle}
        type="grammar"
        id={lessonId}
        onContentGenerated={(content) =>
          setLesson({ ...content, id: lessonId })
        }
      />
    );
  }

  const htmlTheory = marked.parse(lesson.theory);

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="prose prose-invert prose-indigo max-w-none">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          {lesson.title}
        </h1>
        <div
          className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-inner"
          dangerouslySetInnerHTML={{ __html: htmlTheory }}
        />
      </section>

      {lesson.examples && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </span>
            Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 hover:bg-indigo-900/20 transition-colors"
              >
                <p className="text-lg font-medium text-white mb-1">{ex.en}</p>
                <p className="text-sm text-indigo-300">{ex.es}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.quizzes && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </span>
            Practice Quiz
          </h2>
          <GrammarQuiz quizzes={lesson.quizzes} lessonId={lessonId} />
        </section>
      )}
    </div>
  );
}
