import { getAuth } from "@clerk/express";
import express from "express";
import { rateLimiterMiddleware } from "../../lib/rate-limiter-middleware";
import { createProjectSchema } from "../../schemas/project-schema";
import { projectService } from "../../services/project-service";
import z from "zod";
import { promptValidatorMiddleware } from "../../lib/prompt-validator-middleware";
export const projectRoute: express.Router = express.Router();

projectRoute.post(
  "/create-project",
  rateLimiterMiddleware,
  promptValidatorMiddleware,
  async (req, res) => {
    try {
      const { userId } = getAuth(req);
      const validated = createProjectSchema.parse(req.body);
      const newProject = await projectService.createProject(userId!, validated);

      return res.status(200).json({
        success: true,
        message: "Project Created Successfully",
        newProject,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          error: error.issues,
        });
      }
      console.log("Project Creation Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

projectRoute.get("/get-all-projects", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const projects = await projectService.getAllProjects(userId!);

    return res.status(200).json({
      success: true,
      message: "All projects fetched",
      projects,
    });
  } catch (error) {
    console.log("Fetching All Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

projectRoute.get("/:projectId", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { projectId } = req.params;
    const project = await projectService.getProjectById(projectId, userId!);

    return res.status(200).json({
      success: true,
      message: `Project with id: ${projectId} fetched`,
      project,
    });
  } catch (error) {
    console.log("Get Project By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
