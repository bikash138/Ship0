import { FileMap, FileTreeNode } from "@/types";
/**
 * Converts a FileMap object to a tree structure for UI display
 * @param files - FileMap from backend (e.g., { "src/App.tsx": "content..." })
 * @returns Array of FileTreeNode for tree rendering
 */
export const parseFilesToFileTree = (files: FileMap): FileTreeNode[] => {
  if (!files) return [];
  const root: FileTreeNode[] = [];
  let idCounter = 0;
  Object.keys(files).forEach((path) => {
    const parts = path.split("/");
    let currentLevel = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let existing = currentLevel.find((node) => node.name === part);
      if (!existing) {
        const newNode: FileTreeNode = isFile
          ? {
              id: String(idCounter++),
              name: part,
              type: "file",
            }
          : {
              id: String(idCounter++),
              name: part,
              type: "folder",
              children: [],
            };
        currentLevel.push(newNode);
        existing = newNode;
      }
      if (!isFile && existing.type === "folder") {
        currentLevel = existing.children;
      }
    });
  });
  return root;
};

/**
 * Gets file content from FileMap by path
 * @param files - FileMap object
 * @param path - Array of path segments (e.g., ["src", "App.tsx"])
 * @returns File content as string or null if not found
 */
export const getFileContent = (
  files: FileMap,
  path: string[]
): string | null => {
  if (!files) return null;
  const filePath = path.join("/");
  const fileData = files[filePath];
  if (!fileData) return null;
  if (typeof fileData === "string") return fileData;
  return null;
};
