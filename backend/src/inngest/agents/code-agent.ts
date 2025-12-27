import { createAgent, openai } from "@inngest/agent-kit";
import { PROMPT } from "../prompt";
import { createTerminalTool } from "../tools/terminal-tool";
import { createFileOperationTools } from "../tools/file-operations-tool";
import { lastAssistantTextMessageContent } from "../utils";

export const createCodeAgent = (sandboxId: string) => {
  const terminalTool = createTerminalTool(sandboxId);
  const { createOrUpdateFileTool, readFileTool } = createFileOperationTools(sandboxId);

  return createAgent({
    name: "Code Agent",
    description: "Code Agent Expert in generating frontend codes",
    system: PROMPT,
    model: openai({
      model: "gpt-4.1",
      defaultParameters: {
        temperature: 0.1,
      },
    }),
    tools: [terminalTool, createOrUpdateFileTool, readFileTool],
    lifecycle: {
      onResponse: async ({ result, network }) => {
        const lastAssistantMessageText = lastAssistantTextMessageContent(result);
        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessageText;
          }
        }
        return result;
      },
    },
  });
};
