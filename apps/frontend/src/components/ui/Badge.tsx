import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    primary: 'bg-primary/20 text-primary-foreground border-primary/50',
    secondary: 'bg-secondary/20 text-secondary border-secondary/50',
    success: 'bg-success/20 text-success border-success/50',
    warning: 'bg-warning/20 text-warning border-warning/50',
    danger: 'bg-danger/20 text-danger border-danger/50',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
