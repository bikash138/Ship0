import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";

export default function Home() {
  return (
    <div className="bg-background text-foreground h-full overflow-y-auto">
      <Hero />
      <Projects />
      {/* <ActionButtons /> */}
    </div>
  );
}
