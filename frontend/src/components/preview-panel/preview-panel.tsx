"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import PreviewPanelHeader from "./preview-panel-header";
import CodeView from "./code-view";
import { PreviewContent } from "./common/preview-content";
import { usePreviewPanel } from "./hooks/use-preview-panel";
import { PreviewPanelProps } from "./types";

/**
 * PreviewPanel Component
 *
 * Main component for displaying project previews and code.
 * Manages the view state (code/preview) and delegates preview rendering
 * to the PreviewContent component.
 *
 * Features:
 * - Toggle between code and preview views
 * - Automatic sandbox health monitoring
 * - Sandbox recreation on demand
 * - Loading and error state management
 *
 * @param projectId - The ID of the project to preview
 * @param onPreviewStart - Optional callback when preview starts
 * @param onPreviewError - Optional callback when preview errors occur
 * @param onViewChange - Optional callback when view mode changes
 */
const PreviewPanel = ({
  projectId,
  onPreviewStart,
  onPreviewError,
  onViewChange,
}: PreviewPanelProps) => {
  const {
    view,
    setView,
    selectedFragment,
    isCheckingHealth,
    isRecreating,
    isSandboxAlive,
    handleStartPreview,
  } = usePreviewPanel(projectId, onPreviewStart, onPreviewError, onViewChange);

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-border">
      <TooltipProvider>
        {/* Header */}
        <PreviewPanelHeader
          view={view}
          setView={setView}
          selectedFragment={selectedFragment}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {view === "code" ? (
            <CodeView selectedFragment={selectedFragment} />
          ) : (
            <PreviewContent
              isCheckingHealth={isCheckingHealth}
              isRecreating={isRecreating}
              isSandboxAlive={isSandboxAlive}
              selectedFragment={selectedFragment}
              onStartPreview={handleStartPreview}
            />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PreviewPanel;
