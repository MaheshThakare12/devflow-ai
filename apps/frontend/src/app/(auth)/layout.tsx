'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.push('/dashboard');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) return null;
  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-[1000px] flex gap-8 p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
