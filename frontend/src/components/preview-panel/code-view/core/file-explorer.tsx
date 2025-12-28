import React, { useState, memo } from "react";
import { FileTreeNode } from "@/types";
import { FileIcon } from "./file-icon";

const INDENT_SIZE = 16;
const BASE_PADDING = 16;

interface FileTreeItemProps {
  node: FileTreeNode;
  level: number;
  path: string[];
  selectedPath?: string[];
  onSelect: (path: string[]) => void;
}

interface FileTreeProps {
  data: FileTreeNode[];
  selectedPath?: string[];
  onSelect: (path: string[]) => void;
}

interface FileExplorerProps {
  fileTree: FileTreeNode[];
  selectedPath?: string[];
  onSelect: (path: string[]) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = memo(
  ({ node, level, path, selectedPath = [], onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const currentPath = [...path, node.name];
    const isSelected =
      node.type === "file" &&
      JSON.stringify(currentPath) === JSON.stringify(selectedPath);

    const handleClick = () => {
      if (node.type === "folder") {
        setIsOpen(!isOpen);
      } else {
        onSelect(currentPath);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
      if (node.type === "folder") {
        if (e.key === "ArrowRight" && !isOpen) setIsOpen(true);
        if (e.key === "ArrowLeft" && isOpen) setIsOpen(false);
      }
    };

    return (
      <div>
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={node.type === "folder" ? isOpen : undefined}
          className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-colors group ${
            isSelected
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          }`}
          style={{ paddingLeft: `${level * INDENT_SIZE + BASE_PADDING}px` }}
        >
          <FileIcon
            type={node.type}
            isOpen={node.type === "folder" ? isOpen : undefined}
          />
          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
            {node.name}
          </span>
        </div>
        {node.type === "folder" && isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeItem
                key={child.id}
                node={child}
                level={level + 1}
                path={currentPath}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileTreeItem.displayName = "FileTreeItem";

const FileTree: React.FC<FileTreeProps> = ({
  data,
  selectedPath,
  onSelect,
}) => {
  return (
    <div className="w-full">
      {data.map((node) => (
        <FileTreeItem
          key={node.id}
          node={node}
          level={0}
          path={[]}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const FileExplorer = ({
  fileTree,
  selectedPath,
  onSelect,
}: FileExplorerProps) => {
  return (
    <div className="h-full overflow-y-auto py-2">
      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Explorer
      </div>
      <FileTree
        data={fileTree}
        selectedPath={selectedPath}
        onSelect={onSelect}
      />
    </div>
  );
};

export default FileExplorer;
