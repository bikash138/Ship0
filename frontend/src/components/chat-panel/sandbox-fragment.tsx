import { Box, ExternalLink } from "lucide-react";

interface SandboxFragmentProps {
  url: string;
  title: string;
  createdAt?: string;
  onClick?: () => void;
}

const SandboxFragment = ({
  url,
  title,
  createdAt,
  onClick,
}: SandboxFragmentProps) => {
  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors border border-border group flex-1"
      >
        <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
          <Box
            size={20}
            className="text-blue-500 group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-medium text-foreground truncate">
            {title}
          </div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {createdAt
              ? `Created ${new Date(createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`
              : "Click to view in code editor"}
          </div>
        </div>
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-background rounded-lg hover:bg-accent transition-colors border border-border shrink-0"
        title="Open in new tab"
      >
        <ExternalLink size={16} className="text-muted-foreground" />
      </a>
    </div>
  );
};

export default SandboxFragment;
