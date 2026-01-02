import { PreviewContentProps } from "../types";
import { LOADING_MESSAGES, SANDBOX_CONFIG } from "../constants";
import { LoadingState } from "./loading-state";
import { EmptyPreviewState } from "./empty-preview-state";
import { DeadSandboxState } from "./dead-sandbox-state";

/**
 * PreviewContent component
 * Manages the rendering of different preview states (loading, dead, alive, empty)
 */
export const PreviewContent = ({
  isCheckingHealth,
  isRecreating,
  isSandboxAlive,
  selectedFragment,
  onStartPreview,
}: PreviewContentProps) => {
  if (isCheckingHealth) {
    return <LoadingState message={LOADING_MESSAGES.CHECKING} />;
  }

  if (isRecreating) {
    return (
      <LoadingState
        message={LOADING_MESSAGES.RECREATING}
        subtitle={LOADING_MESSAGES.RECREATING_SUBTITLE}
      />
    );
  }

  if (isSandboxAlive === false) {
    return <DeadSandboxState onStart={onStartPreview} />;
  }

  if (isSandboxAlive === true && selectedFragment?.sandboxUrl) {
    return (
      <iframe
        src={selectedFragment.sandboxUrl}
        className="w-full h-full border-none bg-white"
        title={SANDBOX_CONFIG.TITLE}
        loading={SANDBOX_CONFIG.LOADING}
        sandbox={SANDBOX_CONFIG.PERMISSIONS}
      />
    );
  }

  return <EmptyPreviewState />;
};
