export interface SandboxHealth {
  isAlive: boolean;
  sandboxId: string;
}

export interface SandBoxRecreate {
  sandboxUrl: string;
  sandboxId: string;
}