"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center">
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    );
  }

  return (
    <button
      className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
