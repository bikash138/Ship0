import { Loader2 } from "lucide-react";
import { LoadingStateProps } from "../types";

/**
 * Reusable loading state component
 * Displays a spinner with a message and optional subtitle
 */
export const LoadingState = ({ message, subtitle }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
};
