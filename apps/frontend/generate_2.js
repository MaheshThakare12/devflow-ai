const fs = require('fs');
const path = require('path');

const files = {
  "src/components/projects/ProjectForm.tsx": `
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
              className={\`w-8 h-8 rounded-full transition-transform \${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-card' : 'hover:scale-110'}\`}
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
              className={\`w-10 h-10 text-xl rounded-lg transition-colors flex items-center justify-center \${emoji === e ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-white/10'}\`}
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
`,
  "src/app/(dashboard)/projects/[id]/page.tsx": `
'use client';

import { useState } from 'react';
import { useProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Plus, Settings } from 'lucide-react';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { Modal } from '@/components/ui/Modal';
import { AITaskSuggester } from '@/components/ai/AITaskSuggester';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Avatar } from '@/components/ui/Avatar';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: project, isLoading: isProjectLoading } = useProject(params.id);
  const { data: tasks, isLoading: isTasksLoading } = useTasks({ projectId: params.id });
  
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  if (isProjectLoading) return <div className="animate-pulse h-full bg-white/5 rounded-xl"></div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-4xl bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg" style={{ borderColor: project.color }}>
            {project.emoji || '📁'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
            </div>
            <p className="text-slate-400 max-w-2xl">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
             {project.members?.map((member, i) => (
                <Avatar key={i} name={member.name} size="sm" className="border-background border-2" />
             ))}
          </div>
          <Button variant="secondary" onClick={() => setIsAIOpen(true)} className="relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:opacity-100 opacity-0 transition-opacity" />
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="relative font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Suggest Tasks</span>
          </Button>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskBoard tasks={tasks || []} projectId={project._id} />
      </div>

      <Modal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} title="AI Task Suggester" maxWidth="max-w-3xl">
        <AITaskSuggester project={project} onSuccess={() => setIsAIOpen(false)} />
      </Modal>

      <Modal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} title="Create Task">
        <TaskForm projectId={project._id} onSuccess={() => setIsTaskFormOpen(false)} />
      </Modal>
    </div>
  );
}
`,
  "src/components/tasks/TaskBoard.tsx": `
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { useReorderTasks } from '@/hooks/useTasks';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-600' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'done', title: 'Done', color: 'bg-success' }
];

export function TaskBoard({ tasks, projectId }: { tasks: Task[], projectId: string }) {
  const [boardData, setBoardData] = useState<Record<string, Task[]>>({ 'todo': [], 'in-progress': [], 'done': [] });
  const reorderMutation = useReorderTasks();

  useEffect(() => {
    const newData: Record<string, Task[]> = { 'todo': [], 'in-progress': [], 'done': [] };
    tasks.forEach(task => {
      if (newData[task.status]) newData[task.status].push(task);
    });
    
    Object.keys(newData).forEach(key => {
      newData[key].sort((a, b) => a.order - b.order);
    });
    
    setBoardData(newData);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    
    const newBoard = { ...boardData };
    const sourceList = [...newBoard[sourceCol]];
    const destList = sourceCol === destCol ? sourceList : [...newBoard[destCol]];

    const [moved] = sourceList.splice(source.index, 1);
    moved.status = destCol as any;
    destList.splice(destination.index, 0, moved);

    newBoard[sourceCol] = sourceList;
    if (sourceCol !== destCol) newBoard[destCol] = destList;

    sourceList.forEach((t, i) => t.order = i);
    if (sourceCol !== destCol) destList.forEach((t, i) => t.order = i);

    setBoardData(newBoard);

    const updates = [
      ...sourceList.map(t => ({ id: t._id, status: t.status, order: t.order })),
      ...(sourceCol !== destCol ? destList.map(t => ({ id: t._id, status: t.status, order: t.order })) : [])
    ];

    reorderMutation.mutate({ projectId, tasks: updates });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-1 min-w-[300px] max-w-[400px] flex flex-col bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className={\`w-3 h-3 rounded-full \${col.color}\`} />
                <h3 className="font-semibold">{col.title}</h3>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-medium text-slate-300">
                {boardData[col.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={\`flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 transition-colors \${snapshot.isDraggingOver ? 'bg-white/5' : ''}\`}
                >
                  {boardData[col.id]?.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                          className={snapshot.isDragging ? 'z-50 opacity-90' : ''}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
`,
  "src/components/tasks/TaskCard.tsx": `
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
            <div className={\`flex items-center gap-1.5 \${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-danger' : ''}\`}>
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
`,
  "src/components/tasks/TaskForm.tsx": `
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
`,
  "src/components/ai/AITaskSuggester.tsx": `
'use client';

import { useState } from 'react';
import { Project, Task } from '@/types';
import { useSuggestTasks } from '@/hooks/useAI';
import { Button } from '../ui/Button';
import { Sparkles, Check, Loader2 } from 'lucide-react';
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
      { projectId: project._id, title: project.title, description: project.description },
      { 
        onSuccess: (data) => {
          setSuggestions(data.tasks);
          setSelectedIndices(data.tasks.map((_: any, i: number) => i)); // select all by default
        }
      }
    );
  };

  const handleImport = async () => {
    const tasksToImport = selectedIndices.map(i => suggestions[i]);
    if (!tasksToImport.length) return;
    
    setIsImporting(true);
    try {
      await Promise.all(tasksToImport.map(t => api.post('/tasks', { ...t, project: project._id })));
      toast.success(\`Imported \${tasksToImport.length} tasks\`);
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
              className={\`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all \${isSelected ? 'bg-primary/10 border-primary/50' : 'bg-black/20 border-white/5 hover:border-white/20'}\`}
              onClick={() => {
                if (isSelected) setSelectedIndices(prev => prev.filter(i => i !== idx));
                else setSelectedIndices(prev => [...prev, idx]);
              }}
            >
              <div className={\`w-5 h-5 rounded mt-0.5 flex items-center justify-center border \${isSelected ? 'bg-primary border-primary text-white' : 'border-white/20'}\`}>
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
          )
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
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join('c:\\Users\\ADMIN\\OneDrive\\Coding Language\\INNOVATIONHACKS\\PROJECT-1\\apps\\frontend', filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Batch 5 created.');
