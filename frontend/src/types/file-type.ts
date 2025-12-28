export type FileMap = Record<string, string>;

interface FileNodeBase {
  id: string;
  name: string;
}

export interface FileNode extends FileNodeBase {
  type: "file";
  children?: never;
}

export interface FolderNode extends FileNodeBase {
  type: "folder";
  children: FileTreeNode[];
}

export type FileTreeNode = FileNode | FolderNode;
