import { createNetwork } from "@inngest/agent-kit";
import { createCodeEditorAgent } from "../agents/code-editor-agent";
import { createFragmentNameGeneratorAgent } from "../agents/fragment-name-generator-agent";
import { createResponseEnhancerAgent } from "../agents/response-enhancer-agent";
import { INNGEST_CONFIG } from "../config";

export const createCodeEditNetwork = (sandboxId: string) => {
  const codeEditorAgent = createCodeEditorAgent(sandboxId);
  const responseEnhancerAgent = createResponseEnhancerAgent();
  const fragmentNameGenratorAgent = createFragmentNameGeneratorAgent();
  return createNetwork({
    name: "code-edit-network",
    agents: [codeEditorAgent, responseEnhancerAgent, fragmentNameGenratorAgent],
    maxIter: INNGEST_CONFIG.MAX_ITERATION,
    router: async ({ network }) => {
      const summary = network.state.data.summary;
      const enhancedSummary = network.state.data.enhancedSummary;
      const fragmentTitle = network.state.data.fragmentTitle;
      if (summary && !enhancedSummary) {
        return responseEnhancerAgent;
      }
      if (enhancedSummary && !fragmentTitle) {
        return fragmentNameGenratorAgent;
      }
      if (enhancedSummary && fragmentTitle) {
        return;
      }
      return codeEditorAgent;
    },
  });
};
