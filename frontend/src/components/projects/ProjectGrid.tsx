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
