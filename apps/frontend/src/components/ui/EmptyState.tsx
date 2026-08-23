import { FolderKanban, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-black/20">
      <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
        {icon || <FolderKanban className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
