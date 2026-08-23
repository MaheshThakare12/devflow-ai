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
