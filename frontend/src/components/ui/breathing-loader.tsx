"use client";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const loadingTexts = [
  "Thinking...",
  "Generating files...",
  "Setting up environment...",
  "Writing code...",
];

const BreathingLoader = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full gap-3 flex-row">
      {/* Bot Avatar with breathing animation */}
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 animate-breathing">
        <Bot size={16} />
      </div>

      {/* Loading Content */}
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="bg-transparent text-zinc-700 dark:text-zinc-400 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2">
            {/* Animated dots */}
            <span className="animate-pulse">
              {loadingTexts[currentTextIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingLoader;
