const fs = require('fs');
const path = require('path');

const files = {
  "src/app/(dashboard)/tasks/page.tsx": `
'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { Task } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', projectId: '' });
  const { data: tasks, isLoading } = useTasks(filters);
  const { data: projects } = useProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-slate-400">View and manage all your tasks across projects.</p>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} projects={projects || []} />

      {isLoading ? (
        <SkeletonList />
      ) : !tasks?.length ? (
        <EmptyState 
          title="No tasks found" 
          description="Try adjusting your filters or create a new task."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task._id} onClick={() => setSelectedTask(task)}>
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details" maxWidth="max-w-2xl">
        {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      </Modal>
    </div>
  );
}
`,
  "src/components/tasks/TaskFilters.tsx": `
import { Input } from '../ui/Input';
import { Search, X } from 'lucide-react';
import { Project } from '@/types';
import { Button } from '../ui/Button';

export function TaskFilters({ filters, setFilters, projects }: { filters: any, setFilters: any, projects: Project[] }) {
  
  const handleClear = () => setFilters({ search: '', status: '', priority: '', projectId: '' });

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
      <div className="flex-1">
        <Input 
          placeholder="Search tasks..." 
          icon={<Search className="w-4 h-4" />}
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <select 
        className="rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50"
        value={filters.projectId}
        onChange={e => setFilters({ ...filters, projectId: e.target.value })}
      >
        <option value="">All Projects</option>
        {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
      </select>

      <select 
        className="rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50"
        value={filters.status}
        onChange={e => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select 
        className="rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50"
        value={filters.priority}
        onChange={e => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <Button variant="ghost" size="sm" onClick={handleClear} className="self-center">
        <X className="w-4 h-4 mr-2" /> Clear
      </Button>
    </div>
  );
}
`,
  "src/components/tasks/TaskDetailModal.tsx": `
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
        <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>Delete Task</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
`,
  "src/app/(dashboard)/profile/page.tsx": `
'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <Avatar name={user.name} size="xl" className="border-4 border-background shadow-xl" />
          <div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-slate-400 mb-2">{user.email}</p>
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
              {user.role}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" defaultValue={user.name} disabled />
            <Input label="Email Address" defaultValue={user.email} disabled />
            <Input label="Member Since" defaultValue={formatDate(user.createdAt)} disabled />
          </div>
        </div>
      </Card>

      <Card className="p-8 border-danger/20 bg-danger/5">
        <h3 className="text-lg font-semibold text-danger mb-4">Danger Zone</h3>
        <p className="text-slate-400 mb-6">Once you logout, you will need to sign in again to access your projects.</p>
        <Button variant="danger" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </Card>
    </div>
  );
}
`,
  "src/components/dashboard/ProgressRing.tsx": `
import React from 'react';

export function ProgressRing({ radius, stroke, progress, color }: { radius: number, stroke: number, progress: number, color: string }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute font-bold text-xl">{Math.round(progress)}%</div>
    </div>
  );
}
`,
  "src/components/projects/ProjectGrid.tsx": `
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { SkeletonList } from '../ui/Skeleton';

export function ProjectGrid({ projects, isLoading }: { projects?: Project[], isLoading: boolean }) {
  if (isLoading) return <SkeletonList />;
  
  if (!projects?.length) {
    return <div className="text-center py-12 text-slate-400">No projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join('c:\\Users\\ADMIN\\OneDrive\\Coding Language\\INNOVATIONHACKS\\PROJECT-1\\apps\\frontend', filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Batch 6 created.');
