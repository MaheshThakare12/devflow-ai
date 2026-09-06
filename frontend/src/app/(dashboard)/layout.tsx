'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This layout only handles auth guard.
// The DevFlow Sidebar and TopBar are rendered inside page.tsx (DevFlowApp)
// to avoid double-rendering of navigation.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-zinc-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
