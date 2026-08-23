import { cn } from '@/lib/utils';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'flex w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white transition-all',
              'placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-danger focus:ring-danger/50 focus:border-danger',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
