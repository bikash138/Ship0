import { getAuth } from "@clerk/express";
import express from "express";
import { sandboxService } from "../../services/sandbox-service";
export const sandboxRoute: express.Router = express.Router();

sandboxRoute.get("/health", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const sandboxId = req.query.sandboxId as string;

    if (!sandboxId) {
      return res.status(400).json({
        success: false,
        message: "SandboxId is Missing",
      });
    }

    const isAlive = await sandboxService.checkSandboxHealth(sandboxId);

    return res.status(200).json({
      success: true,
      message: "Sandbox health fetched",
      isAlive,
      sandboxId,
    });
  } catch (error) {
    console.log("Fragment health check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

sandboxRoute.post("/recreate", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { fragmentId, files } = req.body;

    if (!fragmentId || !files) {
      return res.status(400).json({
        success: false,
        message: "fragmentId and files are required",
      });
    }

    const { sandboxUrl, sandboxId } = await sandboxService.recreateSandbox(fragmentId, files);

    return res.status(200).json({
      success: true,
      message: "Sandbox recreated successfully",
      sandboxUrl,
      sandboxId,
    });
  } catch (error) {
    console.log("Sandbox recreation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to recreate sandbox",
    });
  }
});
