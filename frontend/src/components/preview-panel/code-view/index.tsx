import React, { memo } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BreadcrumbHeader from "./core/breadcrumb-header";
import CodeArea from "./core/code-area";
import { Fragment } from "@/types";
import FileExplorer from "./core/file-explorer";
import { useFileOperations } from "@/hooks/use-file-operation";

interface CodeViewProps {
  selectedFragment: Fragment | null;
}

const CodeView: React.FC<CodeViewProps> = memo(({ selectedFragment }) => {
  const {
    fileTree,
    selectedPath,
    setSelectedPath,
    selectedFileContent,
    copied,
    handleCopyFileContent,
  } = useFileOperations(selectedFragment);

  if (!fileTree || fileTree.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No files to display</p>
          <p className="text-sm">Waiting for code generation...</p>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        className="bg-background border-r border-border"
      >
        <FileExplorer
          fileTree={fileTree}
          onSelect={(path) => setSelectedPath(path)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-border" />
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <BreadcrumbHeader
            selectedPath={selectedPath}
            copied={copied}
            onCopy={handleCopyFileContent}
          />
          <CodeArea
            selectedFileContent={selectedFileContent}
            selectedPath={selectedPath}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});

export default CodeView;
