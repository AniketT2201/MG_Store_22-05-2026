import * as React from "react";

import { cn } from "../../lib/utils";

export function ResizablePanelGroup({
  className,
  children,
  direction = "horizontal",
}: {
  className?: string;
  children?: React.ReactNode;
  direction?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full",
        direction === "vertical"
          ? "flex-col"
          : "flex-row",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ResizablePanel({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ResizableHandle({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-border w-px",
        className
      )}
    />
  );
}