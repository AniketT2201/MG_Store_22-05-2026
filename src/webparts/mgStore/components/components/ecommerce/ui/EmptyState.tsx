import * as React from "react";
import { motion } from "framer-motion";
import { PackageSearch, Heart, MessageSquareOff, SearchX, Inbox } from "lucide-react";
import { fadeUp } from "../../../utils/animations";

export type EmptyStateIcon = "search" | "wishlist" | "reviews" | "generic" | "inbox";

interface EmptyStateProps {
  icon?: EmptyStateIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Optional secondary link-style action, e.g. "Clear filters" */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ICONS: Record<EmptyStateIcon, React.ComponentType<{ className?: string }>> = {
  search: SearchX,
  wishlist: Heart,
  reviews: MessageSquareOff,
  generic: PackageSearch,
  inbox: Inbox,
};

/**
 * Shared "nothing here" state used across product grids, search, wishlist,
 * and reviews so empty states look intentional and consistent instead of
 * a bare line of text.
 */
export function EmptyState({
  icon = "generic",
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const Icon = ICONS[icon];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-secondary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-10 h-10 text-muted-foreground"  />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      <div className="flex items-center gap-4">
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}
