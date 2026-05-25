import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { X } from "lucide-react";

import { cn } from "../../lib/utils";

export const Drawer =
  DialogPrimitive.Root;

export const DrawerTrigger =
  DialogPrimitive.Trigger;

export const DrawerPortal =
  DialogPrimitive.Portal;

export const DrawerClose =
  DialogPrimitive.Close;

export const DrawerOverlay =
  React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Overlay
    >
  >(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          className
        )}
        {...props}
      />
    )
  );

DrawerOverlay.displayName =
  "DrawerOverlay";

export const DrawerContent =
  React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Content
    >
  >(
    (
      {
        className,
        children,
        ...props
      },
      ref
    ) => (
      <DrawerPortal>
        <DrawerOverlay />

        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-background shadow-xl transition-all duration-300",
            className
          )}
          {...props}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          {children}
        </DialogPrimitive.Content>
      </DrawerPortal>
    )
  );

DrawerContent.displayName =
  "DrawerContent";

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-6",
        className
      )}
      {...props}
    />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col gap-2 p-6",
        className
      )}
      {...props}
    />
  );
}

export const DrawerTitle =
  React.forwardRef<
    HTMLHeadingElement,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Title
    >
  >(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(
          "text-lg font-semibold",
          className
        )}
        {...props}
      />
    )
  );

DrawerTitle.displayName =
  "DrawerTitle";

export const DrawerDescription =
  React.forwardRef<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Description
    >
  >(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn(
          "text-sm text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  );

DrawerDescription.displayName =
  "DrawerDescription";