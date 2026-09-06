import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'low': return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    case 'medium': return 'bg-secondary/20 text-secondary border-secondary/50';
    case 'high': return 'bg-warning/20 text-warning border-warning/50';
    case 'urgent': return 'bg-danger/20 text-danger border-danger/50';
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
  }
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'todo': return 'bg-slate-600/20 text-slate-300 border-slate-600/50';
    case 'in-progress': return 'bg-primary/20 text-primary-foreground border-primary/50';
    case 'done': return 'bg-success/20 text-success border-success/50';
    default: return 'bg-slate-600/20 text-slate-300 border-slate-600/50';
  }
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function generateAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 40%)`;
}
