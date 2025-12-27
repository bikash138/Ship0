import type { AgentResult } from "@inngest/agent-kit";

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAssistantTextMessageIndex];

  if (!message || !("content" in message) || !message.content) {
    return undefined;
  }

  return typeof message.content === "string"
    ? message.content
    : Array.isArray(message.content)
      ? message.content.map((c) => c.text).join("")
      : undefined;
}
