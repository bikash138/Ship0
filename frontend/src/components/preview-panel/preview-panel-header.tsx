import { Code, Eye, RotateCw, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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

interface PreviewPanelHeaderProps {
  view: "code" | "preview";
  setView: (view: "code" | "preview") => void;
  selectedFragment: Fragment | null;
}

const PreviewPanelHeader = ({
  view,
  setView,
  selectedFragment,
}: PreviewPanelHeaderProps) => {
  return (
    <TooltipProvider>
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
        {/* Left: View Toggle */}
        <div className="flex bg-background p-1 rounded-lg border border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setView("code")}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                  view === "code"
                    ? "bg-accent text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
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
                    ? "bg-blue-500/10 text-blue-500 dark:text-blue-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
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
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 text-muted-foreground text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="flex-1 truncate font-mono text-muted-foreground text-xs">
              {selectedFragment?.sandboxUrl}
            </span>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground">
                    <RotateCw size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${selectedFragment?.sandboxUrl}`}
                    className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink size={14} />
                  </Link>
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
    </TooltipProvider>
  );
};

export default PreviewPanelHeader;
