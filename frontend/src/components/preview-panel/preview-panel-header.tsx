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
    </TooltipProvider>
  );
};

export default PreviewPanelHeader;
