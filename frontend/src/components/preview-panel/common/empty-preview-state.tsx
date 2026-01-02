import { STATE_MESSAGES } from "../constants";

/**
 * Empty preview state component
 * Displayed when no fragment is selected
 */
export const EmptyPreviewState = () => {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <p className="text-sm text-muted-foreground">
        {STATE_MESSAGES.NO_PREVIEW}
      </p>
    </div>
  );
};
