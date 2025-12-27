import { Sandbox } from "@e2b/code-interpreter";
import { createTool } from "@inngest/agent-kit";
import { z } from "zod";

export const createFileOperationTools = (sandboxId: string) => {
  const createOrUpdateFileTool = createTool({
    name: "createOrUpdateFiles",
    description: "Create or update files in the sandbox",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
        })
      ),
    }),
    handler: async ({ files }, { step, network }) => {
      const newFiles = await step?.run("createOrUpdateFiles", async () => {
        try {
          const updatedFiles = network.state.data.files || {};
          const sandbox = await Sandbox.connect(sandboxId);
          for (const file of files) {
            await sandbox.files.write(file.path, file.content);
            updatedFiles[file.path] = file.content;
          }
          return updatedFiles;
        } catch (error) {
          return "Error: " + error;
        }
      });
      if (typeof newFiles === "object") {
        network.state.data.files = newFiles;
      }
    },
  });

  const readFileTool = createTool({
    name: "readFiles",
    description: "Read files from the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),
    handler: async ({ files }, { step }) => {
      return await step?.run("readFiles", async () => {
        try {
          const sandbox = await Sandbox.connect(sandboxId);
          const contents = [];
          for (const file of files) {
            const content = await sandbox.files.read(file);
            contents.push({ path: file, content });
          }
          return JSON.stringify(contents);
        } catch (error) {
          return "Error: " + error;
        }
      });
    },
  });

  return { createOrUpdateFileTool, readFileTool };
};
