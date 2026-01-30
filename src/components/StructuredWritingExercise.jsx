import { useState } from "react";

export default function StructuredWritingExercise({ lesson, lessonTitle }) {
    const [step, setStep] = useState(1); // 1: Model, 2: Analyze, 3: Practice
    const [userText, setUserText] = useState("");
    const [showComparison, setShowComparison] = useState(false);

    const completionProgress = (step / 3) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header & Progress */}
            <header className="space-y-6 text-center">
                <span className="inline-block px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-xs font-bold tracking-wide uppercase">
                    Structured Writing
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    {lessonTitle}
                </h1>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-teal-500 transition-all duration-500 ease-out"
                        style={{ width: `${completionProgress}%` }}
                    ></div>
                </div>

                <div className="flex justify-center gap-8 text-sm font-bold text-gray-500">
                    <span className={step >= 1 ? "text-teal-400 transition-colors" : ""}>1. Read</span>
                    <span className={step >= 2 ? "text-teal-400 transition-colors" : ""}>2. Analyze</span>
                    <span className={step >= 3 ? "text-teal-400 transition-colors" : ""}>3. Write</span>
                </div>
            </header>

            {/* Step 1: Model */}
            {step === 1 && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-6">Model Text</h3>
                        <p className="text-xl md:text-2xl leading-relaxed text-gray-200 font-serif whitespace-pre-line">
                            {lesson.modelText}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400 mb-6">Read the text carefully. Notice how it is structured.</p>
                        <button
                            onClick={() => setStep(2)}
                            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                        >
                            Analyze Structure →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Analyze */}
            {step === 2 && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-widest">Model</h3>
                            <p className="text-lg leading-relaxed text-gray-300 font-serif whitespace-pre-line">
                                {lesson.modelText}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-teal-400 mb-4 uppercase tracking-widest">Key Structures</h3>
                            {lesson.analysis.map((item, idx) => (
                                <div key={idx} className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 transition-all hover:bg-teal-500/20">
                                    <p className="font-bold text-white text-lg mb-1">{item.phrase}</p>
                                    <p className="text-gray-400 text-sm">{item.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-gray-400 mb-6">Understand how these phrases build the text.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                            >
                                Start Writing →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Write */}
            {step === 3 && (
                <div className="space-y-8 animate-fade-in-up">
                    {!showComparison ? (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border border-teal-500/30 rounded-2xl p-6">
                                <h3 className="text-teal-300 font-bold mb-2">Assignment</h3>
                                <p className="text-xl text-white font-medium">{lesson.prompt}</p>
                            </div>

                            {/* Hints */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {lesson.analysis.map((item, idx) => (
                                    <span key={idx} className="whitespace-nowrap px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400">
                                        {item.phrase}
                                    </span>
                                ))}
                            </div>

                            <textarea
                                value={userText}
                                onChange={(e) => setUserText(e.target.value)}
                                placeholder="Write your text here..."
                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-6 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-all resize-none text-lg leading-relaxed font-serif"
                            />

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-4 py-2 text-gray-500 hover:text-white transition-colors"
                                >
                                    ← Back to Analysis
                                </button>
                                <button
                                    onClick={() => {
                                        if (userText.trim()) setShowComparison(true);
                                    }}
                                    disabled={!userText.trim()}
                                    className="px-8 py-3 bg-white text-teal-900 font-bold rounded-xl shadow-lg shadow-white/10 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit & Compare
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-white">Good Job!</h2>
                                <p className="text-gray-400">Compare your text with the model structure.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Your Text</h3>
                                    <p className="text-lg leading-relaxed text-white font-serif whitespace-pre-line">
                                        {userText}
                                    </p>
                                </div>
                                <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-teal-500/70 mb-4 uppercase tracking-widest">Structure Model</h3>
                                    <p className="text-lg leading-relaxed text-gray-300 font-serif whitespace-pre-line">
                                        {lesson.modelText}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                                <h4 className="font-bold text-blue-300 mb-2">Self-Reflection Checklist:</h4>
                                <ul className="space-y-2 text-gray-300">
                                    {lesson.analysis.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <input type="checkbox" className="w-5 h-5 rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-transparent" />
                                            <span>Did you use <b>"{item.phrase}"</b> (or similar)?</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-center pt-4">
                                <a
                                    href="/"
                                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
                                >
                                    Finish & Return Home
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
