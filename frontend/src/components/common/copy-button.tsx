import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
  size?: number;
}

export const CopyButton = ({ copied, onCopy, size = 16 }: CopyButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onCopy}
          className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
          aria-label={copied ? "Copied" : "Copy file content"}
        >
          {copied ? (
            <Check size={size} className="text-green-500" />
          ) : (
            <Copy size={size} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : "Copy file content"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
