import { Code, Eye } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
import Link from "next/link";
import { Button } from "../ui/button";
import { Fragment } from "@/types";
import { ViewToggleButton } from "./common/view-toggle-button";
import { SandboxUrlBar } from "./common/sandbox-url-bar";

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
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
        {/* Left: View Toggle */}
        <div className="flex bg-background p-1 rounded-lg border border-border">
          <ViewToggleButton
            icon={Code}
            label="Code View"
            isActive={view === "code"}
            onClick={() => setView("code")}
          />
          <ViewToggleButton
            icon={Eye}
            label="Preview Mode"
            isActive={view === "preview"}
            onClick={() => setView("preview")}
            activeClassName="bg-blue-500/10 text-blue-500 dark:text-blue-400 shadow-sm"
          />
        </div>

        {/* Center: URL Bar */}
        <SandboxUrlBar url={selectedFragment?.sandboxUrl} />

        {/* Right: Upgrade Button */}
        <Link href="/">
          <Button variant="default">Upgrade</Button>
        </Link>
      </div>
    </TooltipProvider>
  );
};

export default PreviewPanelHeader;
