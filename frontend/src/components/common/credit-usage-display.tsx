"use client";

import { useCreditUsage } from "@/hooks/use-credit-usage";
import { Loader2 } from "lucide-react";

export function CreditUsageDisplay() {
  const { data: creditUsage, isLoading, isError } = useCreditUsage();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (isError || !creditUsage) {
    return null;
  }

  const { consumed, total, remaining } = creditUsage;
  const percentage = (consumed / total) * 100;

  // Determine color based on remaining credits
  const getStatusColor = () => {
    if (remaining <= total * 0.1) return "text-red-500";
    if (remaining <= total * 0.3) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = () => {
    if (remaining <= total * 0.1) return "bg-red-500";
    if (remaining <= total * 0.3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 backdrop-blur-sm hover:bg-muted/70 transition-colors">
      {/* Credit Text */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Credits:
        </span>
        <span className={`text-xs font-bold ${getStatusColor()}`}>
          {remaining.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">
          / {total.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar - Hidden on mobile */}
      <div className="hidden sm:block relative h-1.5 w-16 sm:w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
