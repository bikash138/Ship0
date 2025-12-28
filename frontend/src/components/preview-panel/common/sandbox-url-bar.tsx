import { RotateCw, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import Link from "next/link";

interface SandboxUrlBarProps {
  url: string | undefined;
  onRefresh?: () => void;
}

export const SandboxUrlBar = ({ url, onRefresh }: SandboxUrlBarProps) => {
  if (!url) return null;

  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 text-muted-foreground text-sm">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="flex-1 truncate font-mono text-muted-foreground text-xs">
          {url}
        </span>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onRefresh}
                  className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                >
                  <RotateCw size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={url}
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
  );
};
