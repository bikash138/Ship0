import Sandbox from "@e2b/code-interpreter";
import { createTool } from "@inngest/agent-kit";
import z from "zod";

export const createTerminalTool = (sandboxId: string) => {
  return createTool({
    name: "terminal",
    description: "Use terminal to run the commands",
    parameters: z.object({
      command: z.string(),
    }),
    //LLM will generate the required command and pass this to the handler
    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        const buffers = { stdout: "", stderr: "" };

        try {
          //First get the sandboxid to run the command on
          const sandbox = await Sandbox.connect(sandboxId);
          const result = await sandbox.commands.run(command, {
            onStdout(data: string) {
              buffers.stdout += data;
            },
            onStderr(data: string) {
              buffers.stderr += data;
            },
          });
          //Now return the the succes command back to LLM
          return result.stdout;
        } catch (error) {
          //Returns the error messages back to LLM
          console.error(
            `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
          );
          return `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
        }
      });
    },
  });
};
