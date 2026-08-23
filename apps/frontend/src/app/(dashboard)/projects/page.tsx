'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus } from 'lucide-react';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-slate-400">Manage your projects and team collaboration.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-5 h-5 mr-2" /> New Project
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : !filteredProjects?.length ? (
        <EmptyState 
          title="No projects found" 
          description={search ? "Try adjusting your search." : "Create your first project to get started."}
          actionLabel={!search ? "Create Project" : undefined}
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create New Project">
        <ProjectForm onSuccess={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
