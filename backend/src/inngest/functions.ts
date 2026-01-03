import { Inngest } from "inngest";
import { createSandbox, getSandboxUrl } from "./handlers/sandbox-handler";
import { createCodingAgentNetwork } from "./network/code-agent-network";
import { saveResult } from "./handlers/result-handler";
import { fetchLatestFragmentByProjectId } from "./handlers/fragment-handler";
import { createCodeEditNetwork } from "./handlers/code-editor-network";
import { getOrCreateSandbox } from "./handlers/reuse-sandbox-handler";
import { markMessageAsFailed } from "./handlers/function-error-handler";

export const inngest = new Inngest({ id: "ship0" });

const codeAgentFunction = inngest.createFunction(
  {
    id: "code-agent",
    retries: 1,
    timeouts: {
      finish: "3m",
    },
    onFailure: async ({ error, event }) => {
      console.log("=== FAILURE HANDLER TRIGGERED ===");
      console.log("Event data:", JSON.stringify(event.data, null, 2));
      console.log("Error name:", error.name);
      console.log("Error message:", error.message);
      await markMessageAsFailed(new Error(error.message), event.data.event.data.aiMessageId);
    },
  },
  { event: "code-agent/build" },
  async ({ event, step }) => {
    // Create a new sandbox
    const sandboxId = await step.run("get-sandbox-id", async () => {
      return createSandbox();
    });
    // Create the network
    const network = createCodingAgentNetwork(sandboxId);
    // Get the sandbox URL
    const sandboxUrl = await step.run("get-sandbox-url", () => getSandboxUrl(sandboxId));
    // Run the agent network
    const result = await network.run(event.data.value);
    // Save the result in the db
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

const codeEditAgentFunction = inngest.createFunction(
  {
    id: "code-edit-agent",
    retries: 1,
    timeouts: {
      finish: "3m",
    },
    onFailure: async ({ error, event }) => {
      console.log("=== FAILURE HANDLER TRIGGERED (code-edit-agent) ===");
      console.log("Error:", error.message);
      await markMessageAsFailed(new Error(error.message), event.data.event.data.aiMessageId);
    },
  },
  { event: "code-agent/edit" },
  async ({ event, step }) => {
    //Get the last fragment data
    const lastFragment = await step.run("fetch-fragment", async () => {
      try {
        return await fetchLatestFragmentByProjectId(event.data.projectId);
      } catch {
        return null;
      }
    });
    //Check whether we can use old sandbox or not
    const sandboxId = await step.run("get-or-create-sandbbox", async () => {
      if (!lastFragment) {
        return await createSandbox();
      }
      return await getOrCreateSandbox(
        lastFragment.files as Record<string, string>,
        lastFragment.sandboxId
      );
    });
    //Create the network
    const network = lastFragment
      ? createCodeEditNetwork(sandboxId)
      : createCodingAgentNetwork(sandboxId);
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

const handleFunctionCancellation = inngest.createFunction(
  {
    id: "handle-function-cancellation",
    retries: 0,
  },
  { event: "inngest/function.cancelled" },
  async ({ event, step }) => {
    if (
      event.data.function_id === "ship0-code-agent" ||
      event.data.function_id === "ship0-code-edit-agent"
    ) {
      await step.run("mark-assistant-message-failed", async () => {
        const aiMessageId = event.data.event.data.aiMessageId;
        await markMessageAsFailed(new Error("Request timed out"), aiMessageId);
      });
    }
  }
);

export const functions = [codeAgentFunction, codeEditAgentFunction, handleFunctionCancellation];
