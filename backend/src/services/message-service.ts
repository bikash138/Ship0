import { inngest } from "../inngest/functions";
import { prisma } from "../lib/prisma";
import type { CreateMessageInput } from "../schemas/message-schema";

export const messageService = {
  async createMessage(userId: string, data: CreateMessageInput) {
    const project = await prisma.project.findUnique({
      where: {
        userId: userId,
        id: data.projectId,
      },
    });

    if (!project) {
      throw new Error(`Project with id ${data.projectId} not found`);
    }

    const message = await prisma.message.createManyAndReturn({
      data: [
        {
          projectId: data.projectId,
          content: data.content,
          role: "USER",
          type: "RESULT",
          status: "SUCCESS",
        },
        {
          projectId: data.projectId,
          content: "",
          role: "ASSISTANT",
          type: "RESULT",
          status: "QUEUED",
        },
      ],
    });

    const aiMessage = message.find((msg) => msg.role === "ASSISTANT");

    inngest.send({
      name: "code-agent/build",
      data: {
        value: data.content,
        projectId: data.projectId,
        aiMessageId: aiMessage?.id,
      },
    });
    return {
      message,
    };
  },

  async getAllMessage(userId: string, projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        userId: userId,
        id: projectId,
      },
    });

    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const messages = await prisma.message.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        fragments: true,
      },
    });
    return messages;
  },
};
