import { useState, useEffect } from "react";
import { saveProgress } from "../utils/progressStore";

export default function SpeakingDrill({ drills, lessonId }) {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [recognition, setRecognition] = useState(null);

  const currentDrill = drills[currentDrillIndex];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.lang = "en-US";
        reco.interimResults = true;

        reco.onstart = () => setIsRecording(true);
        reco.onend = () => setIsRecording(false);
        reco.onresult = (event) => {
          const t = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");
          setTranscript(t);
        };

        setRecognition(reco);
      } else {
        setFeedback("error-not-supported");
      }
    }
  }, []);

  const startRecording = () => {
    setFeedback(null);
    setTranscript("");
    recognition?.start();
  };

  const stopRecording = () => {
    recognition?.stop();
    checkPronunciation();
  };

  const checkPronunciation = () => {
    if (!transcript) return;

    const target = currentDrill.phrase.toLowerCase().replace(/[.,!?]/g, "");
    const spoken = transcript.toLowerCase().replace(/[.,!?]/g, "");

    if (
      target === spoken ||
      spoken.includes(target) ||
      target.includes(spoken)
    ) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const nextDrill = () => {
    if (currentDrillIndex < drills.length - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1);
      setTranscript("");
      setFeedback(null);
    } else {
      setIsCompleted(true);
      if (lessonId) {
        saveProgress(lessonId, 100);
      }
    }
  };

  const isLast = currentDrillIndex === drills.length - 1;

  if (feedback === "error-not-supported") {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200">
        Your browser does not support Speech Recognition. Please use Chrome.
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-white mb-4">
          Drills Completed!
        </h3>
        <p className="text-gray-300 text-lg mb-6">
          Great job practicing your pronunciation.
        </p>
        <a
          href="/"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors inline-block"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl backdrop-blur-sm text-center">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-gray-400 bg-white/5 rounded-full mb-4">
          Drill {currentDrillIndex + 1} / {drills.length}
        </span>
        <h3 className="text-3xl font-bold text-white mb-2">
          {currentDrill.phrase}
        </h3>
        <p className="text-xl text-gray-400 font-serif italic mb-4">
          {currentDrill.phonetic}
        </p>

        {currentDrill.audioUrl && (
          <button
            onClick={() => new Audio(currentDrill.audioUrl).play()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-full text-sm font-medium transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Listen
          </button>
        )}

        <p className="text-sm text-gray-500">{currentDrill.translation}</p>
      </div>

      <div className="h-24 flex items-center justify-center mb-8">
        {transcript ? (
          <p
            className={`text-xl font-medium ${
              feedback === "correct"
                ? "text-green-400"
                : feedback === "incorrect"
                  ? "text-red-400"
                  : "text-indigo-200"
            }`}
          >
            "{transcript}"
          </p>
        ) : (
          <p className="text-gray-600">Tap below and speak...</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110"
              : "bg-indigo-600 hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/25"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Hold to Speak
        </p>
      </div>

      {feedback === "correct" && (
        <div className="mt-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg mb-4">
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
            <span>Excellent!</span>
          </div>
          <div>
            <button
              onClick={nextDrill}
              className="text-white hover:text-indigo-300 underline underline-offset-4 transition-colors"
            >
              {isLast ? "Finish" : "Next Drill"} &rarr;
            </button>
          </div>
        </div>
      )}

      {feedback === "incorrect" && (
        <div className="mt-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg">
            <span>Try again, clear pronunciation is key.</span>
          </div>
        </div>
      )}
    </div>
  );
}
