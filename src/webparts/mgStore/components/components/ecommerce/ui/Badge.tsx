import * as React from "react";
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    destructive: 'bg-red-100 text-red-700',
    secondary: 'bg-secondary text-secondary-foreground',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </span>
  );
}
