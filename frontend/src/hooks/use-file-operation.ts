import { Fragment } from "@/types";
import { copyToClipboard } from "@/utils/clipboard";
import { getFileContent, parseFilesToFileTree } from "@/utils/file-parser";
import { useMemo, useState } from "react";

export const useFileOperations = (selectedFragment: Fragment | null) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Parse files to tree
  const fileTree = useMemo(() => {
    if (!selectedFragment?.files) return [];
    return parseFilesToFileTree(selectedFragment.files);
  }, [selectedFragment]);

  // Get selected file content
  const selectedFileContent = useMemo(() => {
    if (!selectedFragment?.files || selectedPath.length === 0) return null;
    return getFileContent(selectedFragment.files, selectedPath);
  }, [selectedFragment, selectedPath]);

  // Handle copy
  const handleCopyFileContent = async () => {
    if (!selectedFragment?.files || selectedPath.length === 0) return;
    const content = getFileContent(selectedFragment.files, selectedPath);

    if (content) {
      const success = await copyToClipboard(content, "File content copied!");
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return {
    fileTree,
    selectedPath,
    setSelectedPath,
    selectedFileContent,
    copied,
    handleCopyFileContent,
  };
};
