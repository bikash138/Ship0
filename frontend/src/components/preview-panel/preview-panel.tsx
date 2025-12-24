"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useGetMessages } from "@/hooks/use-messages";
import { useFragment } from "@/contexts/fragment-context";
import { useEffect, useMemo } from "react";
import PreviewPanelHeader from "./preview-panel-header";
import CodeView, { FileNode } from "./code-view";

interface Fragment {
  id: string;
  messsageId: string;
  sandboxUrl: string;
  title: string;
  files: any;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  type: "RESULT" | "ERROR";
  createdAt: string;
  updatedAt: string;
  projectId: string;
  fragments?: Fragment;
}

// Helper function to parse files from fragment
const parseFilesToFileTree = (files: any): FileNode[] => {
  if (!files) return [];

  if (Array.isArray(files)) return files;
  const fileMap: { [key: string]: any } = files;
  const root: FileNode[] = [];
  let idCounter = 0;

  Object.keys(fileMap).forEach((path) => {
    const parts = path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let existing = currentLevel.find((node) => node.name === part);

      if (!existing) {
        const newNode: FileNode = {
          id: String(idCounter++),
          name: part,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
        };
        currentLevel.push(newNode);
        existing = newNode;
      }

      if (!isFile && existing.children) {
        currentLevel = existing.children;
      }
    });
  });

  return root;
};

const getFileContent = (files: any, path: string[]): string | null => {
  if (!files) return null;

  const filePath = path.join("/");

  if (typeof files === "object" && !Array.isArray(files)) {
    const fileData = files[filePath];
    if (fileData) {
      if (typeof fileData === "string") return fileData;
      if (fileData.code) return fileData.code;
      if (fileData.content) return fileData.content;
    }
  }

  return null;
};

const MOCK_FILES: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          { id: "3", name: "header.tsx", type: "file" },
          { id: "4", name: "footer.tsx", type: "file" },
          { id: "5", name: "sidebar.tsx", type: "file" },
        ],
      },
      { id: "6", name: "App.tsx", type: "file" },
      { id: "7", name: "main.tsx", type: "file" },
    ],
  },
  {
    id: "8",
    name: "public",
    type: "folder",
    children: [
      { id: "9", name: "index.html", type: "file" },
      { id: "10", name: "favicon.ico", type: "file" },
    ],
  },
  { id: "11", name: "package.json", type: "file" },
  { id: "12", name: "tsconfig.json", type: "file" },
  { id: "13", name: "README.md", type: "file" },
];

const PreviewPanel = ({ projectId }: { projectId: string }) => {
  const [view, setView] = useState<"code" | "preview">("preview");
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { data: messages, isLoading } = useGetMessages(projectId);
  const { selectedFragment, setSelectedFragment } = useFragment();

  // Extract fragments from messages
  const fragments = useMemo(() => {
    if (!messages) return [];
    return (messages as Message[])
      .filter((msg) => msg.role === "ASSISTANT" && msg.fragments)
      .map((msg) => msg.fragments!);
  }, [messages]);

  // Auto-select latest fragment on mount
  useEffect(() => {
    if (fragments.length > 0 && !selectedFragment) {
      setSelectedFragment(fragments[fragments.length - 1]);
    }
  }, [fragments, selectedFragment, setSelectedFragment]);

  // Parse files from selected fragment
  const fileTree = useMemo(() => {
    if (!selectedFragment?.files) return MOCK_FILES;
    return parseFilesToFileTree(selectedFragment.files);
  }, [selectedFragment]);

  // Get selected file content
  const selectedFileContent = useMemo(() => {
    if (!selectedFragment?.files || selectedPath.length === 0) return null;
    return getFileContent(selectedFragment.files, selectedPath);
  }, [selectedFragment, selectedPath]);

  // Handle copy file content
  const handleCopyFileContent = async () => {
    if (!selectedFragment?.files || selectedPath.length === 0) return;

    const content = getFileContent(selectedFragment.files, selectedPath);

    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("File content copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy content");
      }
    } else {
      toast.error("No content found for this file");
    }
  };

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
            <CodeView
              fileTree={fileTree}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
              selectedFileContent={selectedFileContent}
              copied={copied}
              handleCopyFileContent={handleCopyFileContent}
            />
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
