import Sandbox from "@e2b/code-interpreter";
import { createSandbox } from "./sandbox-handler";

export const getOrCreateSandbox = async (
  oldFiles: Record<string, string>,
  oldSandboxId: string
) => {
  if (oldSandboxId) {
    try {
      const sandbox = await Sandbox.connect(oldSandboxId);
      await sandbox.files.list("/");
      return oldSandboxId;
    } catch {
      console.log(`Sandbox with id ${oldSandboxId} is dead, Creating new one`);
    }
  }
  const newSandboxId = await createSandbox();
  const sandbox = await Sandbox.connect(newSandboxId);
  const files = oldFiles;
  for (const [path, content] of Object.entries(files)) {
    await sandbox.files.write(path, content);
  }
  return newSandboxId;
};
