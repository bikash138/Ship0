export interface NetworkState {
  summary?: string;
  enhancedSummary?: string;
  fragmentTitle?: string;
  files?: Record<string, string>;
}

export interface CodeAgentEventData {
  value: string;
  aiMessageId: string;
}
