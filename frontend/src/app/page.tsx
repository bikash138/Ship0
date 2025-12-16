import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { ActionButtons } from "@/components/home/Action-Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Projects />
      {/* <ActionButtons /> */}
    </div>
  );
}
