'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';

const PRESET_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899', '#3b82f6'];
const PRESET_EMOJIS = ['🚀', '💻', '🎨', '📈', '🔧', '🎯', '💡', '📱', '🎮', '🌐', '📊', '🔥'];

export function ProjectForm({ project, onSuccess }: { project?: Project, onSuccess: () => void }) {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [color, setColor] = useState(project?.color || PRESET_COLORS[0]);
  const [emoji, setEmoji] = useState(project?.emoji || PRESET_EMOJIS[0]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project) {
      updateMutation.mutate({ id: project._id, title, description, color, emoji }, { onSuccess });
    } else {
      createMutation.mutate({ title, description, color, emoji }, { onSuccess });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Project Title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g., Website Redesign" />
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
        <textarea
          className="flex w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[100px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Briefly describe the project..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Color Theme</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-card' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Emoji Icon</label>
        <div className="flex gap-2 flex-wrap bg-black/20 p-2 rounded-lg border border-white/5">
          {PRESET_EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              className={`w-10 h-10 text-xl rounded-lg transition-colors flex items-center justify-center ${emoji === e ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-white/10'}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button variant="ghost" type="button" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>{project ? 'Save Changes' : 'Create Project'}</Button>
      </div>
    </form>
  );
}
