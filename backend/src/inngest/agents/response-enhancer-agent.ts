import { createAgent, openai } from "@inngest/agent-kit";
import { RESPONSE_PROMPT } from "../prompt";
import { lastAssistantTextMessageContent } from "../utils";

export const createResponseEnhancerAgent = () => {
  return createAgent({
    name: "Response Enhancer Agent",
    description: "Enhances the generated task summary",
    system: RESPONSE_PROMPT,
    model: openai({
      model: "gpt-4o-mini",
      defaultParameters: {
        temperature: 0.7,
      },
    }),
    tools: [],
    lifecycle: {
      onResponse: async ({ result, network }) => {
        const enhancedSummary = lastAssistantTextMessageContent(result);
        if (enhancedSummary && network) {
          network.state.data.enhancedSummary = enhancedSummary;
        }
        return result;
      },
    },
  });
};
