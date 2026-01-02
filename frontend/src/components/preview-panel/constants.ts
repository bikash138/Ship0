/**
 * Configuration constants for the Preview Panel
 */

/**
 * Messages displayed during different loading states
 */
export const LOADING_MESSAGES = {
  CHECKING: "Checking sandbox status...",
  RECREATING: "Preparing live preview...",
  RECREATING_SUBTITLE: "This may take a few seconds",
} as const;

/**
 * Messages for empty/error states
 */
export const STATE_MESSAGES = {
  NO_PREVIEW: "No preview available",
  PREVIEW_NOT_AVAILABLE: "Preview Not Available",
  PREVIEW_NEEDS_START: "The preview environment needs to be started",
} as const;

/**
 * Sandbox iframe configuration
 */
export const SANDBOX_CONFIG = {
  PERMISSIONS: "allow-scripts allow-same-origin",
  TITLE: "Preview",
  LOADING: "lazy",
} as const;

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  SANDBOX_HEALTH: "sandbox-health",
} as const;
