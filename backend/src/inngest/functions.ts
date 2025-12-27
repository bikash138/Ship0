import { Inngest } from "inngest";
import { createSandbox, getSandboxUrl } from "./handlers/sandbox-handler";
import { createCodingAgentNetwork } from "./network/code-agent-network";
import { saveResult } from "./handlers/result-handler";

export const inngest = new Inngest({ id: "ship0" });

const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/build" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", createSandbox);
    const network = createCodingAgentNetwork(sandboxId);
    const sandboxUrl = await step.run("get-sandbox-url", () => getSandboxUrl(sandboxId));

    const result = await network.run(event.data.value);
    await step.run("save-result", () =>
      saveResult({
        aiMessageId: event.data.aiMessageId,
        result,
        sandboxUrl,
      })
    );
  }
);

export const functions = [codeAgentFunction];
