import { generateSlug } from "random-word-slugs";
import type { CreateProjectInput } from "../schemas/project-schema";
import { prisma } from "../lib/prisma";
import { inngest } from "../inngest/functions";

export const projectService = {
  async createProject(userId: string, data: CreateProjectInput) {
    const project = await prisma.project.create({
      data: {
        title: generateSlug(4, { format: "kebab" }),
        userId: userId,
        messages: {
          create: [
            {
              content: data.content,
              role: "USER",
              type: "RESULT",
              status: "SUCCESS",
            },
            {
              content: "",
              role: "ASSISTANT",
              type: "RESULT",
              status: "QUEUED",
            },
          ],
        },
      },
      include: { messages: true },
    });

    const aiMessage = project.messages.find((msg) => msg.role === "ASSISTANT");

    try {
      await inngest.send({
        name: "code-agent/build",
        data: {
          value: data.content,
          projectId: project.id,
          aiMessageId: aiMessage?.id,
        },
      });
    } catch (error) {
      console.log("Failed to invoke code-agent function:", error);
      await prisma.message.update({
        where: { id: aiMessage?.id },
        data: {
          status: "FAILED",
          content: "Failed to process your request. Please try again.",
          type: "ERROR",
        },
      });
    }

    return {
      id: project.id,
      title: project.title,
    };
  },

  async getAllProjects(userId: string) {
    return await prisma.project.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  },
};
