import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFragmentSelection } from "@/hooks/use-fragment-selection";
import { useCheckSandboxHealth, useRecreateSandbox } from "@/hooks/use-sandbox";
import { useFragment } from "@/contexts/fragment-context";
import { UsePreviewPanelReturn, ViewMode, PreviewState } from "../types";
import { QUERY_KEYS } from "../constants";

/**
 * @param projectId - The ID of the current project
 * @param onPreviewStart - Optional callback when preview starts
 * @param onPreviewError - Optional callback when preview errors occur
 * @param onViewChange - Optional callback when view mode changes
 */
export const usePreviewPanel = (
  projectId: string,
  onPreviewStart?: () => void,
  onPreviewError?: (error: Error) => void,
  onViewChange?: (view: ViewMode) => void
): UsePreviewPanelReturn => {
  const queryClient = useQueryClient();
  const [view, setViewInternal] = useState<ViewMode>("preview");
  const { selectedFragment } = useFragmentSelection(projectId);
  const { setSelectedFragment } = useFragment();

  const { data: isSandboxAlive, isLoading: isCheckingHealth } =
    useCheckSandboxHealth(selectedFragment?.sandboxId || "");

  const { mutate: recreateSandbox, isPending: isRecreating } =
    useRecreateSandbox();

  /**
   * Wrapper for setView that calls the optional callback
   */
  const setView = useCallback(
    (newView: ViewMode) => {
      setViewInternal(newView);
      onViewChange?.(newView);
    },
    [onViewChange]
  );

  /**
   * Handle starting/recreating the live preview
   */
  const handleStartPreview = useCallback(() => {
    if (!selectedFragment) return;

    onPreviewStart?.();

    recreateSandbox(
      {
        fragmentId: selectedFragment.id,
        files: selectedFragment.files,
      },
      {
        onSuccess: ({ sandboxUrl, sandboxId }) => {
          // Update the fragment with new sandbox URL and ID
          setSelectedFragment({
            ...selectedFragment,
            sandboxUrl: sandboxUrl,
            sandboxId: sandboxId,
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.SANDBOX_HEALTH],
          });
        },
        onError: (error) => {
          console.error("Failed to recreate sandbox:", error);
          onPreviewError?.(error as Error);
        },
      }
    );
  }, [
    selectedFragment,
    recreateSandbox,
    setSelectedFragment,
    queryClient,
    onPreviewStart,
    onPreviewError,
  ]);

  /**
   * Compute the current preview state based on various conditions
   */
  const previewState = useMemo((): PreviewState => {
    if (isCheckingHealth) return "checking";
    if (isRecreating) return "recreating";
    if (isSandboxAlive === false) return "dead";
    if (isSandboxAlive === true) return "alive";
    return "no-fragment";
  }, [isCheckingHealth, isRecreating, isSandboxAlive]);

  return {
    view,
    setView,
    selectedFragment,
    isCheckingHealth,
    isRecreating,
    isSandboxAlive,
    handleStartPreview,
    previewState,
  };
};
