'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex w-full rounded-2xl border border-[#222228] bg-[#151519] overflow-hidden shadow-2xl min-h-[580px]">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-[#1c1c24] to-[#0e0e11] border-r border-[#222228]">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-black font-bold">
              <Sparkles size={18} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">DevFlow</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight text-white">
            Engineering workspace <br/><span className="text-zinc-400">reimagined</span>.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
            AI-assisted task breakdown, real-time sprint tracking, and developer velocity analytics in a clean dark workspace.
          </p>
        </div>
        
        <div className="space-y-3 pt-6 border-t border-[#222228]">
          {['OpenAI GPT-4o Task Generation', 'Real-Time Kanban & Sprint Velocity', 'JWT Security & Role-Based Access'].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
              <CheckCircle2 size={16} className="text-white" />
              {feature}
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#151519]">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome back</h2>
          <p className="text-xs text-zinc-400 mb-8">Sign in to your DevFlow workspace to continue.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
