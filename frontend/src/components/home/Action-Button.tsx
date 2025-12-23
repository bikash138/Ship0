export function ActionButtons() {
  const buttons = [
    {
      icon: "📸",
      label: "Clone a Screenshot",
      description: "Paste a screenshot to create",
    },
    {
      icon: "🎨",
      label: "Import from Figma",
      description: "Connect Figma file",
    },
    {
      icon: "📁",
      label: "Upload a Project",
      description: "Upload codebase",
    },
    {
      icon: "🚀",
      label: "Landing Page",
      description: "Create landing page",
    },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap gap-3 justify-center max-w-2xl">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 hover:border-border/60 transition-all text-sm font-medium text-foreground hover:text-accent group"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {button.label === "Clone a Screenshot" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            )}
            {button.label === "Import from Figma" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            )}
            {button.label === "Upload a Project" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            )}
            {button.label === "Landing Page" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            )}
          </svg>
          {button.label}
        </button>
      ))}
    </div>
  );
}
