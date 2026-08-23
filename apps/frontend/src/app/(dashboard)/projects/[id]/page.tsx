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
