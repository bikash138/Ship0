"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

export function Hero() {
  const [input, setInput] = useState("");

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-border/20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full border border-border/20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-center text-balance leading-tight">
          What do you want to create?
        </h1>

        {/* Input box with tools */}
        <div className="w-full">
          <div className="rounded-2xl border border-white/20 bg-card/50 backdrop-blur-sm p-6">
            <input
              type="text"
              placeholder="Ask s0 to build..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-card rounded-lg transition-colors text-foreground/60 hover:text-foreground">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <button className="p-2 hover:bg-card rounded-lg transition-colors text-foreground/60 hover:text-foreground">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                    />
                  </svg>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 hover:bg-card rounded-lg transition-colors text-foreground/80 hover:text-foreground text-sm font-medium">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  s0 Agent
                  <CaretDownIcon className="h-3 w-3" />
                </button>
              </div>

              <button className="p-2 hover:bg-card rounded-lg transition-colors text-foreground/60 hover:text-foreground">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7 7 7M5 20h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Upgrade info */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-card/30 px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              Upgrade to Team to unlock all of s0's features and more credits
            </span>
            <button className="ml-4 whitespace-nowrap text-white hover:text-foreground font-medium transition-colors flex items-center gap-1">
              Upgrade Plan
              <span className="text-foreground/40">×</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
