'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderKanban, CheckSquare, User, Sparkles, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '../ui/Avatar';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className={cn(
      'relative z-20 h-screen glass border-r border-white/5 transition-all duration-300 flex flex-col',
      collapsed ? 'w-[80px]' : 'w-[280px]'
    )}>
      <div className="flex h-20 items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-primary overflow-hidden">
          <Sparkles className="w-8 h-8 shrink-0 animate-pulse-glow" />
          {!collapsed && <span className="text-xl font-bold text-white tracking-tight">TaskFlow<span className="text-primary">AI</span></span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive 
                  ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary' : 'group-hover:text-white')} />
              {!collapsed && <span className="font-medium">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn('flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4', collapsed ? 'justify-center' : '')}>
          {user && <Avatar name={user.name} size="sm" />}
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors',
            collapsed ? 'justify-center' : ''
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-30"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
