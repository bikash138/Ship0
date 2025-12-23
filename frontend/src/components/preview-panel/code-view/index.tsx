import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FileExplorer, { FileNode } from "./core/file-explorer";
import BreadcrumbHeader from "./core/breadcrumb-header";
import CodeArea from "./core/code-area";

interface CodeViewProps {
  fileTree: FileNode[];
  selectedPath: string[];
  setSelectedPath: (path: string[]) => void;
  selectedFileContent: string | null;
  copied: boolean;
  handleCopyFileContent: () => void;
}

const CodeView: React.FC<CodeViewProps> = ({
  fileTree,
  selectedPath,
  setSelectedPath,
  selectedFileContent,
  copied,
  handleCopyFileContent,
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        className="bg-zinc-900/50 border-r border-zinc-800"
      >
        <FileExplorer
          fileTree={fileTree}
          onSelect={(path) => setSelectedPath(path)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-zinc-800" />
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
};

export default CodeView;
export type { FileNode };
