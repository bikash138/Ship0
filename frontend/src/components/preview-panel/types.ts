/**
 * Type definitions for the Preview Panel component
 */

import { Fragment } from "@/types/message-type";

/**
 * Preview panel view modes
 */
export type ViewMode = "code" | "preview";

/**
 * Preview state represents the current status of the sandbox preview
 */
export type PreviewState =
  | "checking"
  | "recreating"
  | "dead"
  | "alive"
  | "no-fragment";

/**
 * Props for the main PreviewPanel component
 */
export interface PreviewPanelProps {
  projectId: string;
  onPreviewStart?: () => void;
  onPreviewError?: (error: Error) => void;
  onViewChange?: (view: ViewMode) => void;
}

/**
 * Props for the PreviewContent component
 */
export interface PreviewContentProps {
  isCheckingHealth: boolean;
  isRecreating: boolean;
  isSandboxAlive: boolean | undefined;
  selectedFragment: Fragment | null;
  onStartPreview: () => void;
}

/**
 * Props for loading state components
 */
export interface LoadingStateProps {
  message: string;
  subtitle?: string;
}

/**
 * Props for dead sandbox state component
 */
export interface DeadSandboxStateProps {
  onStart: () => void;
}

/**
 * Return type for usePreviewPanel hook
 */
export interface UsePreviewPanelReturn {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  selectedFragment: Fragment | null;
  isCheckingHealth: boolean;
  isRecreating: boolean;
  isSandboxAlive: boolean | undefined;
  handleStartPreview: () => void;
  previewState: PreviewState;
}
