import ProjectForm from "../common/Project-Form";

export function Hero() {
  return (
    <main className="flex flex-col items-center justify-center mt-20">
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-center text-balance leading-tight">
          What do you want to create?
        </h1>

        {/* Input box with tools */}
        <div className="w-full">
          <ProjectForm/>
        </div>
      </div>
    </main>
  );
}
