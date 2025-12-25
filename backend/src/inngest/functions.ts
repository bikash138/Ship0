import { Inngest } from "inngest";
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";
import { lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "./prompt";
import { prisma } from "../lib/prisma";
import { MessageType } from "../../generated/prisma/enums";

export const inngest = new Inngest({ id: "ship0" });

const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/build" },
  //So the first task is to create the sandbox and connect with it with the id where the agent will code
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("ship0-nextjs");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "Code Agent",
      description: "Code Agent Expert in genrating frontend codes",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        //We will be having 3 tools
        //1. Running the terimal commands
        createTool({
          name: "terminal",
          description: "Use terminal to run the commands",
          parameters: z.object({
            command: z.string(),
          }),
          //LLM will genrate the required command and pass this to the handler
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
                    buffers.stdout += data;
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
        }),

        //2. Creating/Updating Files
        createTool({
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
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = (await network.state.data.files) || {};
                  const sandbox = await Sandbox.connect(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              }
            );
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        //3. Reading Files
        createTool({
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
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);
    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run('save-result', async()=>{
      if(isError){
        return await prisma.message.update({
          where:{
            id: event.data.aiMessageId
          },
          data: {
            content: "Something went wrong",
            type: MessageType.ERROR,
            status: "FAILED"
          }
        })
      }
      return await prisma.message.update({
        where: {
          id: event.data.aiMessageId
        },
        data: {
          content: result.state.data.summary,
          type: MessageType.RESULT,
          status: "SUCCESS",
          fragments: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "Untitled",
              files: result.state.data.files
            }
          }
        },
      });
    })
  }
);

export const functions = [codeAgentFunction];
