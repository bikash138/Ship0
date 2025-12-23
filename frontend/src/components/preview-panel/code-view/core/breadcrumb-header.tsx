import React from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbHeaderProps {
  selectedPath: string[];
  copied: boolean;
  onCopy: () => void;
}

const BreadcrumbHeader = ({
  selectedPath,
  copied,
  onCopy,
}: BreadcrumbHeaderProps) => {
  if (selectedPath.length === 0) return null;

  return (
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
              {index < selectedPath.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onCopy}
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
  );
};

export default BreadcrumbHeader;
