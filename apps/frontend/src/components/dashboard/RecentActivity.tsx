import { Task } from '@/types';
import { Card } from '../ui/Card';
import { getStatusColor, formatRelativeDate } from '@/lib/utils';
import { CheckSquare } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function RecentActivity({ tasks }: { tasks: Task[] }) {
  if (!tasks.length) return <Card className="p-6"><p className="text-slate-400 text-center">No recent activity.</p></Card>;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {tasks.map(task => (
          <div key={task._id} className="flex gap-4 group">
            <div className="mt-1">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/20 transition-colors">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-tight group-hover:text-primary transition-colors">{task.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{typeof task.project === 'object' ? task.project.title : 'Project'}</span>
                <span>•</span>
                <span>{formatRelativeDate(task.updatedAt || task.createdAt)}</span>
              </div>
            </div>
            <div>
              <Badge variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'primary' : 'default'}>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
