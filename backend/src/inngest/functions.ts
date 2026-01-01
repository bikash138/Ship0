import { Inngest } from "inngest";
import { createSandbox, getSandboxUrl } from "./handlers/sandbox-handler";
import { createCodingAgentNetwork } from "./network/code-agent-network";
import { saveResult } from "./handlers/result-handler";
import { fetchLatestFragmentByProjectId } from "./handlers/fragment-handler";
import { createCodeEditNetwork } from "./handlers/code-editor-network";
import { getOrCreateSandbox } from "./handlers/reuse-sandbox-handler";

export const inngest = new Inngest({ id: "ship0" });

const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/build" },
  async ({ event, step }) => {
    // Create a new sandbox
    const sandboxId = await step.run("get-sandbox-id", createSandbox);
    // Create the network
    const network = createCodingAgentNetwork(sandboxId);
    // Get the sandbox URL
    const sandboxUrl = await step.run("get-sandbox-url", () => getSandboxUrl(sandboxId));
    // Run the agent network
    const result = await network.run(event.data.value);
    // Save the result in the db
    await step.run("save-result", () =>
      saveResult({
        aiMessageId: event.data.aiMessageId,
        result,
        sandboxUrl,
        sandboxId,
      })
    );
  }
);

const codeEditAgentFunction = inngest.createFunction(
  { id: "code-edit-agent" },
  { event: "code-agent/edit" },
  async ({ event, step }) => {
    //Get the last fragment data
    const lastFragment = await step.run("fetch-fragment", () =>
      fetchLatestFragmentByProjectId(event.data.projectId)
    );
    //Check whether we can use old sandbox or not
    const sandboxId = await step.run("get-or-create-sandbbox", () =>
      getOrCreateSandbox(lastFragment.files as Record<string, string>, lastFragment.sandboxId)
    );
    //Create the network
    const network = createCodeEditNetwork(sandboxId);
    //Run the agent network
    const result = await network.run(event.data.value);
    //Get the sandbox url
    const sandboxUrl = await step.run("get-sandbox-url", () => getSandboxUrl(sandboxId));
    //Save the result is the db
    await step.run("save-result", () => {
      saveResult({
        aiMessageId: event.data.aiMessageId,
        result,
        sandboxUrl,
        sandboxId,
      });
    });
  }
);

export const functions = [codeAgentFunction, codeEditAgentFunction];
