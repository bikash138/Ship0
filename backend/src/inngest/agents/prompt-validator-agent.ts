import { createAgent, gemini } from "@inngest/agent-kit";
import { PROMPT_VALIDATION_SYSTEM } from "../prompt";

export const createPromptValidatorAgent = () => {
  return createAgent({
    name: "Prompt Validator Agent",
    description: "Validates the user's prompt for valid project request",
    system: PROMPT_VALIDATION_SYSTEM,
    model: gemini({
      model: "gemini-2.5-flash",
      defaultParameters: {
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
    }),
    tools: [],
  });
};
