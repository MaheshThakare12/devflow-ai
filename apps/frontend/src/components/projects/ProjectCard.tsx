import { Project } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project._id}`}>
      <Card className="h-full flex flex-col group overflow-hidden hover:border-primary/50 transition-all duration-300 relative">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: project.color || '#6366f1' }} />
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
              {project.emoji || '📁'}
            </div>
            <Badge variant={project.status === 'active' ? 'success' : 'default'}>
              {project.status}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">{project.description}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 3).map((member, i) => (
                <Avatar key={i} name={member.name} size="sm" className="border-card border-2" />
              ))}
              {(project.members?.length || 0) > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-card flex items-center justify-center text-xs font-medium z-10">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {formatDate(project.createdAt)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
