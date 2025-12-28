import React, { memo, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CopyButton } from "@/components/common/copy-button";

interface BreadcrumbHeaderProps {
  selectedPath: string[];
  copied: boolean;
  onCopy: () => void;
}

const BreadcrumbHeader = memo(
  ({ selectedPath, copied, onCopy }: BreadcrumbHeaderProps) => {
    const breadcrumbItems = useMemo(() => {
      return selectedPath.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {index === selectedPath.length - 1 ? (
              <BreadcrumbPage>{item}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink className="hover:text-foreground transition-colors cursor-pointer">
                {item}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < selectedPath.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ));
    }, [selectedPath]);

    if (selectedPath.length === 0) {
      return (
        <div className="h-10 border-b border-border flex items-center px-4 bg-background">
          <span className="text-sm text-muted-foreground">
            Select a file to view its content
          </span>
        </div>
      );
    }

    return (
      <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-background">
        <Breadcrumb>
          <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
        </Breadcrumb>

        <CopyButton copied={copied} onCopy={onCopy} />
      </div>
    );
  }
);

BreadcrumbHeader.displayName = "BreadcrumbHeader";

export default BreadcrumbHeader;
