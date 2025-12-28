import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface ViewToggleButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export const ViewToggleButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  activeClassName = "bg-accent text-foreground shadow-sm",
}: ViewToggleButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
            isActive
              ? activeClassName
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={16} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
