import { Inngest } from "inngest";
import { openai, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";

export const inngest = new Inngest({ id: "ship0" });

const helloWord = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("ship0-nextjs");
      return sandbox.sandboxId;
    });

    // const supportAgent = createAgent({
    //   model: openai({ model: "gpt-3.5-turbo" }),
    //   name: "Typescript Agent",
    //   system: `You are an autonomous software agent responsible for generating complete project structures that can be executed inside an E2B sandbox. Your output must be a pure JSON object describing all files required for the project. Each file must contain its full path (from the project root) and its exact content.
    //         Rules:
    //         - Output ONLY JSON. No markdown, no code fences, no comments, no explanations.
    //         - Use this exact structure: { "files": [ { "path": "...", "content": "..." } ] }
    //         - Include ALL necessary project files: configs, tsconfig, package.json, source code, components, styles, utilities, etc.
    //         - The returned files must be self-contained and runnable inside a fresh E2B environment.
    //         - File paths must use POSIX format (e.g., "src/app/page.tsx").
    //         - Do not abbreviate or omit content. Return full file contents.
    //         - Never include placeholders like "...". Always return complete code.
    //         - If the project requires installing dependencies, include them inside package.json.`,
    // });

    // const { output } = await supportAgent.run("Create a todo app");

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandboxUrl = await Sandbox.connect(sandboxId);
      const host = sandboxUrl.getHost(3000);
      return `http://${host}`;
    });

    return {
      message: `The Sandbox URL is: ${sandboxUrl}`,
    };
  }
);
console.log("Functions created success");

const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/build" },
  //So the first task is to create the sandbox and connect with it with the id where the agent will code
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("ship-nextjs");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "Code Agent",
      description: "Code Agent Expert in genrating frontend codes",
      system: "",
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
            )
          }),
          handler: async({files}, {step, network})=>{
            const newFiles = await step?.run('createOrUpdateFiles', async()=>{
              try{
                const updatedFiles = await network.state.data.files || {}
                const sandbox = await Sandbox.connect(sandboxId)
                for(const file of files){
                  await sandbox.files.write(file.path, file.content)
                  updatedFiles[file.path] = file.content
                }
                return updatedFiles
              }catch(error){
                return "Error: " + error
              }
            })
            if(typeof newFiles === "object"){
              network.state.data.files = newFiles
            }
          }
        }),
        
        //3. Reading Files
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string())
          }),
          handler: async({files}, {step})=>{
            return await step?.run('readFiles', async()=>{
              try{
                const sandbox = await Sandbox.connect(sandboxId);
                const contents = []
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({path: file, content})
                }
                return JSON.stringify(contents)
              }catch(error){
                return "Error: " + error
              }
            })
            
          }
        })
      ],
    });
  }
);

export const functions = [helloWord];
