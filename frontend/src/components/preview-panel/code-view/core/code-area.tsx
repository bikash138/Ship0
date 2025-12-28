import { Code } from "lucide-react";
import { CodeHighlight } from "./code-view";
import { memo } from "react";

interface CodeAreaProps {
  selectedFileContent: string | null;
  selectedPath: string[];
}

const CodeArea = memo(
  ({ selectedFileContent, selectedPath }: CodeAreaProps) => {
    return (
      <div className="flex-1 w-full overflow-auto bg-background">
        {selectedFileContent ? (
          <CodeHighlight code={selectedFileContent} lang="javascript" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
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
    );
  }
);
CodeArea.displayName = "CodeArea";

export default CodeArea;
