import { createAgent, openai } from "@inngest/agent-kit";
import { lastAssistantTextMessageContent } from "../utils";
import { CODE_EDITOR_PROMPT } from "../prompt";
import { createTerminalTool } from "../tools/terminal-tool";
import { createFileOperationTools } from "../tools/file-operations-tool";

export const createCodeEditorAgent = (sandboxId: string) => {
  const { createOrUpdateFileTool, readFileTool } = createFileOperationTools(sandboxId);
  const terminalTool = createTerminalTool(sandboxId);
  return createAgent({
    name: "Code Editor",
    description: "Updates the built project according to the user message",
    system: CODE_EDITOR_PROMPT,
    model: openai({
      model: "gpt-4.1",
      defaultParameters: {
        temperature: 0.1,
      },
    }),
    tools: [createOrUpdateFileTool, readFileTool, terminalTool],
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
