"use client";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import PreviewPanelHeader from "./preview-panel-header";
import CodeView from "./code-view";
import { useFragmentSelection } from "@/hooks/use-fragment-selection";
import { useFileOperations } from "@/hooks/use-file-operation";

const PreviewPanel = ({ projectId }: { projectId: string }) => {
  const [view, setView] = useState<"code" | "preview">("preview");
  const { selectedFragment } = useFragmentSelection(projectId);

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
            <iframe
              src={selectedFragment?.sandboxUrl}
              className="w-full h-full border-none bg-white"
              title="Preview"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PreviewPanel;
