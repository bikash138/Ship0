import { createAgent, openai } from "@inngest/agent-kit";
import { FRAGMENT_NAME_PROMPT } from "../prompt";
import { lastAssistantTextMessageContent } from "../utils";

export const createFragmentNameGeneratorAgent = () => {
  return createAgent({
    name: "Fragment Name Generator",
    description: "Generates a concise title for the fragment",
    system: FRAGMENT_NAME_PROMPT,
    model: openai({
      model: "gpt-4o-mini",
      defaultParameters: {
        temperature: 0.7,
      },
    }),
    tools: [],
    lifecycle: {
      onResponse: async ({ result, network }) => {
        const fragmentTitle = lastAssistantTextMessageContent(result);
        if (fragmentTitle && network) {
          network.state.data.fragmentTitle = fragmentTitle;
        }
        return result;
      },
    },
  });
};
