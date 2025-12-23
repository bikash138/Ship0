import { Box, ExternalLink } from "lucide-react";

interface SandboxFragmentProps {
  url: string;
  title: string;
  onClick?: () => void;
}

const SandboxFragment = ({ url, title, onClick }: SandboxFragmentProps) => {
  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800 group flex-1"
      >
        <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
          <Box
            size={20}
            className="text-blue-500 group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-medium text-zinc-100 truncate">
            {title}
          </div>
          <div className="text-xs text-zinc-500 truncate mt-0.5">
            Click to view in code editor
          </div>
        </div>
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800 shrink-0"
        title="Open in new tab"
      >
        <ExternalLink size={16} className="text-zinc-400" />
      </a>
    </div>
  );
};

export default SandboxFragment;
