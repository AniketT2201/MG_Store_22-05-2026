import * as React from "react";

import { SearchIcon } from "lucide-react";

import { cn } from "../../lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (
    open: boolean
  ) => void;

  children?: React.ReactNode;

  title?: string;

  description?: string;

  className?: string;

  showCloseButton?: boolean;
}

export function CommandDialog({
  open,
  onOpenChange,
  children,
  title = "Search",
  description = "Search products...",
  className,
  showCloseButton = true,
}: CommandDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogHeader className="sr-only">
        <DialogTitle>
          {title}
        </DialogTitle>

        <DialogDescription>
          {description}
        </DialogDescription>
      </DialogHeader>

      <DialogContent
        className={cn(
          "overflow-hidden p-0",
          className
        )}
        showCloseButton={
          showCloseButton
        }
      >
        <div className="flex flex-col bg-popover text-popover-foreground rounded-md">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function CommandInput({
  className,
  ...props
}: CommandInputProps) {
  return (
    <div className="flex h-12 items-center gap-2 border-b px-3">
      <SearchIcon className="size-4 shrink-0 opacity-50" />

      <input
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface CommandListProps {
  children?: React.ReactNode;

  className?: string;
}

export function CommandList({
  children,
  className,
}: CommandListProps) {
  return (
    <div
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandEmpty({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="py-6 text-center text-sm">
      {children}
    </div>
  );
}

interface CommandGroupProps {
  children?: React.ReactNode;

  className?: string;
}

export function CommandGroup({
  children,
  className,
}: CommandGroupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandSeparator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-border h-px w-full",
        className
      )}
    />
  );
}

interface CommandItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CommandItem({
  className,
  children,
  ...props
}: CommandItemProps) {
  return (
    <div
      className={cn(
        "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}