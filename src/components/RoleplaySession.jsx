import { useState, useEffect } from "react";
import { saveProgress } from "../utils/progressStore";

export default function RoleplaySession({ scenario, lessonId }) {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setMessages([
      { role: "assistant", content: scenario.initial_message || "Hello!" },
    ]);

    speak(scenario.initial_message || "Hello!");

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.lang = "en-US";
        reco.interimResults = true;

        reco.onstart = () => setIsRecording(true);
        reco.onend = () => {
          setIsRecording(false);
        };
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

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    setTranscript("");
    recognition?.start();
  };

  const stopRecording = () => {
    recognition?.stop();
    setTimeout(() => {
      if (transcript.length > 2) {
        handleSendMessage(transcript);
      }
    }, 800);
  };

  const handleSendMessage = async (text) => {
    const newMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setTranscript("");
    setProcessing(true);

    try {
      setTimeout(() => {
        const responses = [
          "That's interesting, tell me more.",
          "I understand. How does that make you feel?",
          "Great. Let's continue.",
          "Could you rephrase that slightly?",
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        speak(reply);
        setProcessing(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  const finishSession = () => {
    if (lessonId) saveProgress(lessonId, 100);
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white/10 text-gray-200 rounded-bl-none"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {processing && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none animate-pulse text-gray-400">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-black/20 rounded-3xl backdrop-blur-md flex items-center justify-between gap-4">
        <input
          type="text"
          value={transcript}
          readOnly
          placeholder="Hold mic to speak..."
          className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0"
        />
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110" : "bg-indigo-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
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

      <button
        onClick={finishSession}
        className="mt-4 text-gray-500 text-sm hover:text-white transition-colors"
      >
        End Roleplay
      </button>
    </div>
  );
}
