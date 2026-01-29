import { useState, useEffect } from "react";
import { saveProgress } from "../utils/progressStore";

export default function ShadowingSession({ session, lessonId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [recognition, setRecognition] = useState(null);

  const currentSegment = session.segments[currentIndex];

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
            .map((r) => r[0].transcript)
            .join("");
          setTranscript(t);
        };
        setRecognition(reco);
      }
    }
  }, []);

  const playAudio = () => {
    if (currentSegment.audioUrl) {
      new Audio(currentSegment.audioUrl).play();
    } else {
      const utterance = new SpeechSynthesisUtterance(currentSegment.text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    setTranscript("");
    setFeedback(null);
    recognition?.start();
  };

  const stopRecording = () => {
    recognition?.stop();
    setTimeout(() => {
      const target = currentSegment.text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const spoken = transcript.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (spoken.length > 0) {
        setFeedback("good");
      } else {
        setFeedback("retry");
      }
    }, 500);
  };

  const handleNext = () => {
    if (currentIndex < session.segments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTranscript("");
      setFeedback(null);
    } else {
      if (lessonId) saveProgress(lessonId, 100);
      alert("Shadowing Session Completed!");
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="mb-4 text-sm text-gray-400 uppercase tracking-widest">
          Segment {currentIndex + 1} / {session.segments.length}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 leading-relaxed">
          "{currentSegment.text}"
        </h2>
        <div className="flex items-center justify-center gap-4 text-lg text-indigo-300 font-serif italic mb-8">
          <span>{currentSegment.ipa}</span>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={playAudio}
            className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 flex items-center justify-center transition-all"
          >
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 shadow-red-500/50 shadow-lg scale-110" : "bg-white/10 hover:bg-white/20 text-gray-200"}`}
          >
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>

        {transcript && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">You said:</p>
            <p className="text-xl text-white">"{transcript}"</p>
          </div>
        )}

        {feedback === "good" && (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
          >
            Next Segment &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
