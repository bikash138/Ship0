import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  path: string[];
  onSelect: (path: string[]) => void;
}

interface FileTreeProps {
  data: FileNode[];
  onSelect: (path: string[]) => void;
}

interface FileExplorerProps {
  fileTree: FileNode[];
  onSelect: (path: string[]) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  path,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentPath = [...path, node.name];

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onSelect(currentPath);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-1.5 hover:bg-accent/50 cursor-pointer transition-colors group"
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        {node.type === "folder" && (
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === "folder" ? (
          <Folder
            size={16}
            className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors"
          />
        ) : (
          <File
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          />
        )}
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
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ data, onSelect }) => {
  return (
    <div className="w-full">
      {data.map((node) => (
        <FileTreeItem
          key={node.id}
          node={node}
          level={0}
          path={[]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const FileExplorer = ({ fileTree, onSelect }: FileExplorerProps) => {
  return (
    <div className="h-full overflow-y-auto py-2">
      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Explorer
      </div>
      <FileTree data={fileTree} onSelect={onSelect} />
    </div>
  );
};

export default FileExplorer;
