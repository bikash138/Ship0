import type { Request, Response, NextFunction } from "express";
import { createPromptValidatorAgent } from "../inngest/agents/prompt-validator-agent";
import { type TextMessage } from "@inngest/agent-kit";

const validatePrompt = async (prompt: string) => {
  try {
    const agent = createPromptValidatorAgent();
    const result = await agent.run(prompt);
    const message = result.output[0] as TextMessage;
    const content =
      typeof message.content === "string"
        ? message.content
        : message.content.map((c) => c.text).join("");
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("Prompt validation error:", error);
    return {
      isValid: false,
      response: "Something went wrong while validation the prompt",
    };
  }
};

export const promptValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const { isValid, reason } = await validatePrompt(content);
    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: reason,
      });
    }
    next();
  } catch (error) {
    console.error("Prompt validator middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
