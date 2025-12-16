import { getAuth } from "@clerk/express";
import express from "express";
import { prisma } from "../../lib/prisma";
import { MessageType, MessageRole } from "../../../generated/prisma/enums";
import { inngest } from "../../inngest/functions";
export const messageRoute: express.Router = express.Router();

messageRoute.post("/create-message", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { message, projectId } = req.body;
    if (!userId) {
      throw new Error("User un authorized");
    }
    //Find the project with the given projectId
    const project = await prisma.project.findUnique({
      where: {
        userId: userId,
        id: projectId,
      },
    });

    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const newMessage = await prisma.message.create({
      data: {
        projectId: projectId,
        content: message,
        role: MessageRole.USER,
        type: MessageType.RESULT,
      },
    });

    inngest.send({
      name: "code-agent/build",
      data: {
        value: message,
        projectId: projectId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Message created Success",
      newMessage,
    });
  } catch (error) {
    console.log("Something went wrong while creating Message", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

messageRoute.get("/get-all-messages", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const projectId = req.query.projectId as string;
    if (!userId) {
      throw new Error("User un authorized");
    }
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

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Something went wrong while fetching all messages", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
