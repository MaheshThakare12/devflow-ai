'use client';

import { useState } from 'react';
import { Project, Task } from '@/types';
import { useSuggestTasks } from '@/hooks/useAI';
import { Button } from '../ui/Button';
import { Sparkles, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getPriorityColor } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export function AITaskSuggester({ project, onSuccess }: { project: Project, onSuccess: () => void }) {
  const [suggestions, setSuggestions] = useState<Partial<Task>[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  
  const suggestMutation = useSuggestTasks();
  const queryClient = useQueryClient();

  const handleSuggest = () => {
    suggestMutation.mutate(
      { projectTitle: project.title, projectDescription: project.description },
      { 
        onSuccess: (tasks) => {
          setSuggestions(tasks);
          setSelectedIndices(tasks.map((_: any, i: number) => i));
        }
      }
    );
  };

  const handleImport = async () => {
    const tasksToImport = selectedIndices.map(i => suggestions[i]);
    if (!tasksToImport.length) return;
    
    setIsImporting(true);
    try {
      await Promise.all(tasksToImport.map(t => api.post('/tasks', { ...t, projectId: project._id })));
      toast.success(`Imported ${tasksToImport.length} tasks`);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess();
    } catch (error) {
      toast.error('Failed to import some tasks');
    } finally {
      setIsImporting(false);
    }
  };

  if (!suggestions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Let AI Break It Down</h3>
        <p className="text-slate-400 max-w-md mb-8">
          Our AI will analyze your project title and description to suggest a comprehensive list of actionable tasks.
        </p>
        <Button onClick={handleSuggest} isLoading={suggestMutation.isPending} size="lg" className="w-full sm:w-auto">
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[70vh]">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Suggested Tasks ({selectedIndices.length} selected)</h3>
        <p className="text-sm text-slate-400">Review and select which tasks to import into your project.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {suggestions.map((task, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all ${isSelected ? 'bg-primary/10 border-primary/50' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
              onClick={() => {
                if (isSelected) setSelectedIndices(prev => prev.filter(i => i !== idx));
                else setSelectedIndices(prev => [...prev, idx]);
              }}
            >
              <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-white' : 'border-white/20'}`}>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority || 'medium')}>{task.priority}</Badge>
                </div>
                <p className="text-sm text-slate-400">{task.description}</p>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-3">
                    {task.tags.map((t, i) => <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded">#{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-6 mt-4 border-t border-white/10">
        <Button variant="ghost" onClick={() => setSelectedIndices(suggestions.map((_, i) => i))}>Select All</Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onSuccess}>Cancel</Button>
          <Button onClick={handleImport} isLoading={isImporting} disabled={!selectedIndices.length}>
            Import Selected
          </Button>
        </div>
      </div>
    </div>
  );
}