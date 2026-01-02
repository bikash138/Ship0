import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeadSandboxStateProps } from "../types";
import { STATE_MESSAGES } from "../constants";

/**
 * Dead sandbox state component
 * Displayed when the sandbox is not alive and needs to be started
 */
export const DeadSandboxState = ({ onStart }: DeadSandboxStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {STATE_MESSAGES.PREVIEW_NOT_AVAILABLE}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {STATE_MESSAGES.PREVIEW_NEEDS_START}
          </p>
        </div>
        <Button onClick={onStart} size="lg" className="gap-2">
          <Play className="w-4 h-4" />
          Start Live Preview
        </Button>
      </div>
    </div>
  );
};
