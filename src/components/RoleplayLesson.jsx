import { useState } from "react";
import RoleplaySession from "./RoleplaySession.jsx";
import AIContentGenerator from "./AIContentGenerator.jsx";

export default function RoleplayLesson({
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
          type="roleplay"
          id={lessonId}
          onContentGenerated={(content) =>
            setLesson({ ...content, id: lessonId })
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col justify-center min-h-[80vh]">
      <div className="text-center space-y-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-sm font-semibold tracking-wide uppercase">
          AI Roleplay
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {lesson.title}
        </h1>
        <p className="text-lg text-gray-400">{lesson.description}</p>
      </div>

      <RoleplaySession scenario={lesson} lessonId={lessonId} />
    </div>
  );
}
