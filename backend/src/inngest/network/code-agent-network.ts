import { createNetwork } from "@inngest/agent-kit";
import { createCodeAgent } from "../agents/code-agent";
import { createResponseEnhancerAgent } from "../agents/response-enhancer-agent";
import { createFragmentNameGeneratorAgent } from "../agents/fragment-name-generator-agent";
import { INNGEST_CONFIG } from "../config";

export const createCodingAgentNetwork = (sandboxId: string) => {
  const codeAgent = createCodeAgent(sandboxId);
  const responseEnhancerAgent = createResponseEnhancerAgent();
  const fragmentNameGeneratorAgent = createFragmentNameGeneratorAgent();
  return createNetwork({
    name: "coding-agent-network",
    agents: [codeAgent, responseEnhancerAgent, fragmentNameGeneratorAgent],
    maxIter: INNGEST_CONFIG.MAX_ITERATION,
    router: async ({ network }) => {
      const summary = network.state.data.summary;
      const enhancedSummary = network.state.data.enhancedSummary;
      const fragmentTitle = network.state.data.fragmentTitle;
      if (summary && !enhancedSummary) {
        return responseEnhancerAgent;
      }
      if (enhancedSummary && !fragmentTitle) {
        return fragmentNameGeneratorAgent;
      }
      if (enhancedSummary && fragmentTitle) {
        return;
      }
      return codeAgent;
    },
  });
};
