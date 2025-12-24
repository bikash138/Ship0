"use client";
import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <div className="bg-secondary-background text-foreground h-screen overflow-y-auto border-2 border-border rounded-md ml-2 mr-2 mb-2 flex flex-col">
      <div className="flex-1">
        <Hero />
        {isSignedIn ? <Projects /> : null}
        {/* <ActionButtons /> */}
      </div>
      <Footer />
    </div>
  );
}
