"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeTransition() {
  const { resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevTheme, setPrevTheme] = useState<string | undefined>();

  useEffect(() => {
    if (!prevTheme) {
      setPrevTheme(resolvedTheme);
      return;
    }

    if (prevTheme !== resolvedTheme) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevTheme(resolvedTheme);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, prevTheme]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-9999"
      style={{
        backdropFilter: isTransitioning ? "blur(12px)" : "blur(0px)",
        WebkitBackdropFilter: isTransitioning ? "blur(12px)" : "blur(0px)",
        backgroundColor: isTransitioning ? "rgba(0, 0, 0, 0.1)" : "transparent",
        opacity: isTransitioning ? 1 : 0,
        transition: isTransitioning ? "all 0.1s ease-out" : "all 0.4s ease-in",
      }}
    />
  );
}
