import ProjectForm from "../common/Project-Form";

export function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
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
          <ProjectForm/>

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
