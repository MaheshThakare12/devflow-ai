'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
