import React, { useEffect, useRef, useState } from "react";
import StatsPanel from "./StatsPanel.tsx";
import ResultPanel from "./ResultPanel.tsx";
import { getRandomSample } from "../utils/textSamples.ts";


export default function TypingTest() {
  const [reference, setReference] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const [duration, setDuration] = useState<number>(60);
  const [remaining, setRemaining] = useState<number>(60);

  const [started, setStarted] = useState<boolean>(false);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);

  const [showResult, setShowResult] = useState<boolean>(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastInputRef = useRef<string>("");


  // Reset test
  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setReference(getRandomSample());
    setInput("");
    setStarted(false);
    setRemaining(duration);
    setTypedChars(0);
    setCorrectChars(0);
    setErrors(0);
    setShowResult(false);
    lastInputRef.current = "";
  };

  // Start test
  const startTest = () => {
    if (started) return;

    setStarted(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setRemaining(rem);

      if (rem <= 0) endTest();
    }, 100);
  };

  const endTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setShowResult(true);
  };

  // Handle typing
  const handleInput = (value: string) => {
    if (!started && value.length > 0) startTest();

    // Count typed chars
    if (value.length > lastInputRef.current.length) {
      setTypedChars((prev) => prev + (value.length - lastInputRef.current.length));
    }
    lastInputRef.current = value;

    setInput(value);

    let correct = 0;
    let err = 0;

    for (let i = 0; i < reference.length; i++) {
      const typed = value[i];
      const ref = reference[i];

      if (!typed) continue;
      if (typed === ref) correct++;
      else err++;
    }

    if (value.length > reference.length) {
      err += value.length - reference.length;
    }

    setCorrectChars(correct);
    setErrors(err);
  };

  // Stats
  const elapsedSeconds = duration - remaining;
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);

  const wpm = Math.round((correctChars / 5) / minutes) || 0;
  const cpm = Math.round(correctChars / minutes) || 0;
  const accuracy =
    typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

  useEffect(() => {
    resetTest();
  }, [duration]);

  // Render characters
  const renderText = () => {
    return reference.split("").map((char, i) => {
      let className = "px-[1px]";

      if (i < input.length) {
        if (input[i] === char) className += " text-green-400";
        else className += " text-red-400 underline decoration-red-400/30";
      }

      if (i === input.length) {
        className += " bg-purple-500/20 rounded";
      }

      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#002252] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-400 flex items-center justify-center font-bold">
            TS
          </div>
          <div>
            <h1 className="text-lg font-semibold">Typing Speed Test</h1>
            <p className="text-sm text-gray-400">
              Measure typing speed (WPM) and accuracy
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-3">
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-[#002252] border border-white/10 rounded px-2 py-1"
            >
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={120}>120s</option>
            </select>

            <button
              onClick={startTest}
              className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-cyan-400 font-semibold"
            >
              Start
            </button>

            <button
              onClick={resetTest}
              className="px-4 py-2 rounded border border-white/10 text-gray-400"
            >
              Restart
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap text-center">
            <StatsPanel label="Time" value={`${Math.floor(remaining)}s`} />
            <StatsPanel label="WPM" value={wpm} />
            <StatsPanel label="CPM" value={cpm} />
            <StatsPanel label="Accuracy" value={`${accuracy}%`} />
            <StatsPanel label="Errors" value={errors} />
            
          </div>
        </div>

        {/* Quote */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded leading-relaxed text-lg font-serif">
          {renderText()}
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInput(e.target.value)}
          disabled={showResult}
          placeholder="Start typing..."
          className="w-full mt-4 p-3 bg-transparent border border-white/10 rounded outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Result */}
        {showResult && (
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded">
            <h3 className="font-semibold mb-3">Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <ResultPanel label="WPM" value={wpm} />
              <ResultPanel label="Accuracy" value={`${accuracy}%`} />
              <ResultPanel label="CPM" value={cpm} />
              <ResultPanel label="Errors" value={errors} />
            </div>
            
            <button
              onClick={resetTest}
              className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-cyan-400"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
