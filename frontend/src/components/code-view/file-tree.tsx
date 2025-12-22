"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

interface FileTreeProps {
  data: FileNode[];
  level?: number;
  onSelect?: (path: string[]) => void;
  parentPath?: string[];
}

export const FileTree = ({
  data,
  level = 0,
  onSelect,
  parentPath = [],
}: FileTreeProps) => {
  return (
    <div className="w-full">
      {data.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          level={level}
          onSelect={onSelect}
          currentPath={[...parentPath, node.name]}
        />
      ))}
    </div>
  );
};

const FileTreeNode = ({
  node,
  level,
  onSelect,
  currentPath,
}: {
  node: FileNode;
  level: number;
  onSelect?: (path: string[]) => void;
  currentPath: string[];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (node.type === "file") {
    return (
      <button
        onClick={() => onSelect?.(currentPath)}
        className={cn(
          "flex items-center gap-2 w-full hover:bg-zinc-800/50 py-1 px-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded-sm",
          "text-left"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <File size={14} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 w-full hover:bg-zinc-800/50 py-1 px-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded-sm",
            "text-left"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <ChevronRight
            size={14}
            className={cn("transition-transform", isOpen && "rotate-90")}
          />
          <Folder size={14} />
          <span className="truncate">{node.name}</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {node.children && (
          <FileTree
            data={node.children}
            level={level + 1}
            onSelect={onSelect}
            parentPath={currentPath}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
