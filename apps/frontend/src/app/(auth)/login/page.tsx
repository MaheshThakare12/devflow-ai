'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { CheckSquare } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex w-full glass rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-primary/20 to-transparent border-r border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/20 rounded-xl">
              <CheckSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">TaskFlow AI</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Manage your work <br/><span className="gradient-text">intelligently</span>.</h2>
          <p className="text-slate-400 text-lg">AI-powered task management for high-performing teams. Let the machine do the planning, so you can focus on building.</p>
        </div>
        
        <div className="space-y-4">
          {['AI Task Generation', 'Smart Prioritization', 'Real-time Collaboration'].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {feature}
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center bg-card">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to your account to continue.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
