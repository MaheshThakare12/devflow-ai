'use client';

import { useState } from 'react';
import { useCreateTask } from '@/hooks/useTasks';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function TaskForm({ projectId, onSuccess }: { projectId: string, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  
  const createMutation = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, description, priority: priority as any, status: status as any, project: projectId }, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Task Title" required value={title} onChange={e => setTitle(e.target.value)} />
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
        <textarea
          className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[100px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
          <select 
            className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select 
            className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
        <Button variant="ghost" type="button" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" isLoading={createMutation.isPending}>Create Task</Button>
      </div>
    </form>
  );
}
