import { useState } from "react";
import ShadowingSession from "./ShadowingSession.jsx";
import AIContentGenerator from "./AIContentGenerator.jsx";

export default function ShadowingLesson({
  initialLesson,
  lessonId,
  lessonTitle,
}) {
  const [lesson, setLesson] = useState(initialLesson);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          {lessonTitle}
        </h1>
        <AIContentGenerator
          topic={lessonTitle}
          type="shadowing"
          id={lessonId}
          onContentGenerated={(content) =>
            setLesson({ ...content, id: lessonId })
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 h-full flex flex-col justify-center min-h-[70vh]">
      <div className="text-center space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-wide uppercase">
          Shadowing Studio
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          {lesson.title}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {lesson.description}
        </p>
      </div>

      <ShadowingSession session={lesson} lessonId={lessonId} />
    </div>
  );
}
