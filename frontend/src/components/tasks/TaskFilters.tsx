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
