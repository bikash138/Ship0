import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { ActionButtons } from "@/components/home/Action-Button";

export default function Home() {
  return (
    <div className="bg-background text-foreground h-full overflow-y-auto">
      <Hero />
      <Projects />
      {/* <ActionButtons /> */}
    </div>
  );
}
