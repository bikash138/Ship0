"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";

    const timestamp = new Date().getTime();
    const faviconPath =
      resolvedTheme === "dark"
        ? `/favicon-dark.ico?v=${timestamp}`
        : `/favicon-light.ico?v=${timestamp}`;

    link.href = faviconPath;

    document.head.appendChild(link);

    console.log(`Favicon updated: ${resolvedTheme} mode - ${faviconPath}`);
  }, [resolvedTheme]);

  return null;
}
