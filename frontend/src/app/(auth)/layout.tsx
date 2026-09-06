'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.push('/');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) return null;
  if (user) return null;

  return (
    <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center p-4">
      {/* Subtle background glow like dashboard */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}
