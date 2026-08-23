import { Task } from '@/types';
import { Badge } from '../ui/Badge';
import { getPriorityColor, getStatusColor, formatDate } from '@/lib/utils';
import { AlignLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDeleteTask } from '@/hooks/useTasks';

export function TaskDetailModal({ task, onClose }: { task: Task, onClose: () => void }) {
  const deleteMutation = useDeleteTask();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task._id, { onSuccess: onClose });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
         <h3 className="text-2xl font-bold">{task.title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Badge className={getStatusColor(task.status)}>{task.status.replace('-', ' ')}</Badge>
        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-black/20 border border-white/5">
        <div className="space-y-1">
          <div className="text-slate-400 text-sm flex items-center gap-2"><User className="w-4 h-4" /> Assignee</div>
          <div className="font-medium">{task.assignee?.name || 'Unassigned'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-slate-400 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Due Date</div>
          <div className="font-medium">{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</div>
        </div>
      </div>

      {task.description && (
        <div className="space-y-2">
          <div className="text-slate-400 text-sm flex items-center gap-2 font-medium">
            <AlignLeft className="w-4 h-4" /> Description
          </div>
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 whitespace-pre-wrap">
            {task.description}
          </div>
        </div>
      )}

      {task.tags?.length > 0 && (
        <div className="space-y-2">
          <div className="text-slate-400 text-sm flex items-center gap-2 font-medium">
            <Tag className="w-4 h-4" /> Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {task.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-sm bg-white/10 text-slate-200 border border-white/10">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending}>Delete Task</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
