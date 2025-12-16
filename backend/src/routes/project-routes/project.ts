import { getAuth } from "@clerk/express";
import express from "express";
import { prisma } from "../../lib/prisma";
import { generateSlug } from "random-word-slugs";
import { inngest } from "../../inngest/functions";
export const projectRoute: express.Router = express.Router();

projectRoute.post("/create-project", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { content } = req.body;
    if (!userId) {
      throw new Error("User unautorized");
    }
    const newProject = await prisma.project.create({
      data: {
        title: generateSlug(4, { format: "kebab" }),
        userId: userId,
        messages: {
          create: {
            content: content,
            role: "USER",
            type: "RESULT",
          },
        },
      },
    });

    await inngest.send({
      name: "code-agent/build",
      data: {
        value: content,
        projectId: newProject.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project Created Success",
      newProject,
    });
  } catch (error) {
    console.log("Something went wrong while creating Project", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

projectRoute.get("/get-all-projects", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("User unautorized");

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.log(`Something went wrong while getting all projects`, error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

projectRoute.get("/:projectId", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("User unautorized");
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(404).json({
        success: false,
        message: "Project id not defined",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id: ${projectId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.log(`Something went wrong while getting the project`, error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
