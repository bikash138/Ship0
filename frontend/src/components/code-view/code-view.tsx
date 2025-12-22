"use client";
import React, { useState } from "react";
import {
  Code,
  Eye,
  RotateCw,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileTree, FileNode } from "./file-tree";
import { useGetMessages } from "@/hooks/use-messages";
import { useFragment } from "@/contexts/fragment-context";
import { useEffect, useMemo } from "react";
import { CodeHighlight } from "./Code";
import Link from "next/link";
import { Button } from "../ui/button";

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

  // If files is already an array of FileNode, return it
  if (Array.isArray(files)) return files;

  // If files is a flat object like { "path/to/file.tsx": { code: "..." } }
  // Convert to FileNode tree structure
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

// Helper function to get file content from fragment
const getFileContent = (files: any, path: string[]): string | null => {
  if (!files) return null;

  const filePath = path.join("/");

  // If files is an object with file paths as keys
  if (typeof files === "object" && !Array.isArray(files)) {
    const fileData = files[filePath];
    if (fileData) {
      // Handle different file data structures
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

const CodeView = ({ projectId }: { projectId: string }) => {
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
    <div className="w-full h-full flex flex-col bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
      <TooltipProvider>
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
          {/* Left: View Toggle */}
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setView("code")}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                    view === "code"
                      ? "bg-zinc-800 text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Code size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setView("preview")}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                    view === "preview"
                      ? "bg-blue-500/10 text-blue-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Eye size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview Mode</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Center: URL Bar (Visible only in preview) */}
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="flex-1 truncate font-mono text-zinc-500 text-xs">
                {selectedFragment?.sandboxUrl}
              </span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-zinc-300">
                      <RotateCw size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-zinc-300">
                      <ExternalLink size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right: Upgrade Button */}
          <Link href="/#">
            <Button variant="default">Upgrade</Button>
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {view === "code" ? (
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full h-full"
            >
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                // maxSize={40}
                className="bg-zinc-900/50 border-r border-zinc-800"
              >
                <div className="h-full overflow-y-auto py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Explorer
                  </div>
                  <FileTree
                    data={fileTree}
                    onSelect={(path) => setSelectedPath(path)}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-zinc-800" />
              <ResizablePanel defaultSize={80}>
                <div className="flex flex-col h-full">
                  {/* Breadcrumbs Header */}
                  {selectedPath.length > 0 && (
                    <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/30">
                      <Breadcrumb>
                        <BreadcrumbList>
                          {selectedPath.map((item, index) => (
                            <React.Fragment key={index}>
                              <BreadcrumbItem>
                                {index === selectedPath.length - 1 ? (
                                  <BreadcrumbPage>{item}</BreadcrumbPage>
                                ) : (
                                  <BreadcrumbLink className="hover:text-zinc-200 transition-colors cursor-pointer">
                                    {item}
                                  </BreadcrumbLink>
                                )}
                              </BreadcrumbItem>
                              {index < selectedPath.length - 1 && (
                                <BreadcrumbSeparator />
                              )}
                            </React.Fragment>
                          ))}
                        </BreadcrumbList>
                      </Breadcrumb>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleCopyFileContent}
                            className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-200"
                          >
                            {copied ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copied ? "Copied!" : "Copy file content"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {/* Code Area */}
                  <div className="flex-1 w-full overflow-auto bg-zinc-950/50">
                    {selectedFileContent ? (
                      <CodeHighlight
                        code={selectedFileContent}
                        lang="javascript"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-500">
                        <div className="text-center">
                          <Code size={48} className="mx-auto mb-4 opacity-50" />
                          <p>
                            {selectedPath.length > 0
                              ? "Loading file content..."
                              : "Select a file to view content"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
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

export default CodeView;
