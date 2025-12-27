import express from "express";
import { getAuth } from "@clerk/express";
import { createMessageSchema } from "../../schemas/message-schema";
import { messageService } from "../../services/message-service";
import z from "zod";
export const messageRoute: express.Router = express.Router();

messageRoute.post("/create-message", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const validated = createMessageSchema.parse(req.body);
    const newMessage = await messageService.createMessage(userId!, validated);

    return res.status(200).json({
      success: true,
      message: "Message created Success",
      newMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.issues,
      });
    }
    console.log("Create Message Error:", error);

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
    const messages = await messageService.getAllMessage(userId!, projectId);

    return res.status(200).json({
      success: true,
      message: "All message fetched",
      messages,
    });
  } catch (error) {
    console.log("Fetching All Message Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
