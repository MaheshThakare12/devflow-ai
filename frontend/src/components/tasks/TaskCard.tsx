import { Task } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getPriorityColor } from '@/lib/utils';
import { Calendar, AlignLeft, MessageSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { format } from 'date-fns';

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="p-4 hover:border-primary/50 cursor-grab active:cursor-grabbing group transition-all">
      <div className="flex justify-between items-start mb-3 gap-2">
        <h4 className="font-semibold text-slate-100 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {task.title}
        </h4>
        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
      </div>
      
      {task.description && (
        <div className="text-slate-400 text-sm line-clamp-2 mb-4 flex items-start gap-2">
           <AlignLeft className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
           <span>{task.description}</span>
        </div>
      )}
      
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300 border border-white/10">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-danger' : ''}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar name={task.assignee.name} size="sm" />
        )}
      </div>
    </Card>
  );
}
