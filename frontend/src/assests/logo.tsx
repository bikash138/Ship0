"use client";
import Image from "next/image";
import whiteLogo from "./white-logo.png";
import blackLogo from "./black-logo.png";
import { Jersey_10 } from "next/font/google";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const jersey = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

export function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : "dark";
  const isDark = currentTheme === "dark";

  return (
    <div className="flex items-center gap-1">
      <div
        className={`rounded-sm p-2 sm:p-1.5 ${
          isDark ? "bg-background" : "bg-background"
        }`}
      >
        <Image
          src={isDark ? whiteLogo : blackLogo}
          alt="Ship0 Logo"
          width={44}
          height={44}
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
        />
      </div>
      <span
        className={`${jersey.className} text-foreground text-2xl tracking-widest`}
      >
        Ship0
      </span>
    </div>
  );
}
