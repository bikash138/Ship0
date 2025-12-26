"use client";
import ProjectForm from "../common/project-form";
import { motion } from "motion/react";
import { Jersey_10, Space_Grotesk } from "next/font/google";
import { QuickActions } from "./QuickActions";
import { useRef, useState } from "react";

const jersey = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Hero() {
  const[quickPrompt, setQuickPrompt] = useState("")
  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden mt-10">
      {/* Background S0 text */}
      <div
        className="absolute top-0 left-0 right-0 h-[350px] flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        <motion.div
          className={`${jersey.className} text-[20rem] md:text-[30rem] lg:text-[40rem] bg-linear-to-b from-zinc-500/20 to-zinc-300/20 bg-clip-text text-transparent font-bold`}
          style={{ lineHeight: 0.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          S0
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Main heading */}
        <h1
          className={`${spaceGrotesk.className} text-5xl md:text-6xl font-bold text-center text-balance leading-tight`}
        >
          What do you want to create?
        </h1>

        {/* Input box with tools */}
        <div className="min-w-full min-h-fullmax-h-full">
          <ProjectForm initialPrompt={quickPrompt}/>
        </div>

        {/* Quick action buttons */}
        <QuickActions onQuickActionClick={setQuickPrompt}/>
      </div>
    </main>
  );
}
