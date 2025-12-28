"use client";

import { useGetProjects } from "@/hooks/use-project";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";

export const Projects = () => {
  const { data: projects, isLoading } = useGetProjects();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  const latestProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4 shadow-none flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6 text-foreground text-center sm:text-left ">
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestProjects.map((project: Project) => (
          <Link href={`/chat/${project.id}`} key={project.id}>
            <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-lg font-medium truncate"
                  title={project.title}
                >
                  {project.title || "Untitled Project"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    {new Date(project.createdAt).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
