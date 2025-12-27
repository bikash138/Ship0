import Sandbox from "@e2b/code-interpreter";
import { INNGEST_CONFIG } from "../config";

export const createSandbox = async (): Promise<string> => {
  const sandbox = await Sandbox.create(INNGEST_CONFIG.SANDBOX_TEMPLATE);
  return sandbox.sandboxId;
};

export const getSandboxUrl = async (sandboxId: string): Promise<string> => {
  const sandbox = await Sandbox.connect(sandboxId);
  const host = sandbox.getHost(INNGEST_CONFIG.SANDBOX_PORT);
  return `https://${host}`;
};
