import Sandbox from "@e2b/code-interpreter";
import { getOrCreateSandbox } from "../inngest/handlers/reuse-sandbox-handler";
import { getSandboxUrl } from "../inngest/handlers/sandbox-handler";
import { prisma } from "../lib/prisma";

export const sandboxService = {
  async checkSandboxHealth(sandboxId: string) {
    try {
      const sandbox = await Sandbox.connect(sandboxId);
      await sandbox.files.list("/");
      return true;
    } catch (error) {
      return false;
    }
  },

  async recreateSandbox(fragmentId: string, files: Record<string, string>) {
    try {
      const newSandboxId = await getOrCreateSandbox(files, "");
      const newSandboxUrl = await getSandboxUrl(newSandboxId);

      await prisma.fragment.update({
        where: { id: fragmentId },
        data: {
          sandboxId: newSandboxId,
          sandboxUrl: newSandboxUrl,
        },
      });

      return {
        sandboxUrl: newSandboxUrl,
        sandboxId: newSandboxId,
      };
    } catch (error) {
      console.error("Error recreating sandbox:", error);
      throw new Error("Failed to recreate sandbox");
    }
  },
};
