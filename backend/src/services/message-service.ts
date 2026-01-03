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

    try {
      await inngest.send({
        name: "code-agent/edit",
        data: {
          value: data.content,
          projectId: data.projectId,
          aiMessageId: aiMessage?.id,
        },
      });
    } catch (error) {
      console.log("Failed to invoke code-agent/edit function:", error);
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
      select: {
        id: true,
        content: true,
        role: true,
        status: true,
        createdAt: true,
        fragments: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });
    const lastMessageWithFragment = messages
      .slice()
      .reverse()
      .find((msg) => msg.role === "ASSISTANT" && msg.fragments !== null);

    if (lastMessageWithFragment?.fragments?.id) {
      const fullFragment = await prisma.fragment.findUnique({
        where: {
          id: lastMessageWithFragment.fragments.id,
        },
        select: {
          id: true,
          title: true,
          sandboxUrl: true,
          files: true,
          createdAt: true,
          sandboxId: true,
        },
      });
      if (fullFragment) {
        lastMessageWithFragment.fragments = fullFragment;
      }
    }
    return messages;
  },
};
