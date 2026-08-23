'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '../ui/Avatar';

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const getPageTitle = () => {
    if (pathname.startsWith('/projects/')) return 'Project Details';
    if (pathname.startsWith('/projects')) return 'Projects';
    if (pathname.startsWith('/tasks')) return 'Tasks';
    if (pathname.startsWith('/profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <header className="h-20 glass border-b border-white/5 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-slate-900" />
        </button>
        {user && <Avatar name={user.name} size="md" className="cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors" />}
      </div>
    </header>
  );
}
