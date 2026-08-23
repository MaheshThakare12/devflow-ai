'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, FolderKanban, BarChart3, ListTodo } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full rounded-2xl border border-[#222228] overflow-hidden shadow-2xl min-h-[600px]">
      
      {/* Left Panel — same card style as Dashboard sidebar */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#151519] border-r border-[#222228] p-10">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2.5 mb-10">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-black shadow-sm">
              <Sparkles size={17} />
            </span>
            <span className="font-semibold tracking-tight text-base text-white">DevFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Your engineering<br />workspace, supercharged.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            AI-assisted planning, real-time task tracking, and sprint analytics — all in one matte dark workspace.
          </p>

          {/* Mini dashboard preview cards */}
          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-[#222228] bg-[#1c1c22] p-4 flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#222228] text-zinc-300">
                <FolderKanban size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Projects</p>
                <p className="text-[11px] text-zinc-400">Manage & track all projects</p>
              </div>
              <span className="ml-auto text-xs font-bold text-emerald-400">4 active</span>
            </div>
            <div className="rounded-xl border border-[#222228] bg-[#1c1c22] p-4 flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#222228] text-zinc-300">
                <ListTodo size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Tasks</p>
                <p className="text-[11px] text-zinc-400">AI-generated breakdowns</p>
              </div>
              <span className="ml-auto text-xs font-bold text-blue-400">24 open</span>
            </div>
            <div className="rounded-xl border border-[#222228] bg-[#1c1c22] p-4 flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#222228] text-zinc-300">
                <BarChart3 size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Analytics</p>
                <p className="text-[11px] text-zinc-400">Sprint velocity & deep work</p>
              </div>
              <span className="ml-auto text-xs font-bold text-amber-400">+8.2%</span>
            </div>
          </div>
        </div>

        {/* Weekly goal bar — same as sidebar widget */}
        <div className="rounded-xl bg-[#1c1c22] p-4 border border-[#26262e]">
          <div className="flex justify-between text-[11px] text-zinc-400 mb-2">
            <span className="font-semibold text-white">Weekly goal</span>
            <span>72%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#26262e]">
            <div className="h-full w-[72%] rounded-full bg-white" />
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">18 of 25 tasks completed this week</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 bg-[#0e0e11] p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-sm w-full mx-auto">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-black">
              <Sparkles size={15} />
            </span>
            <span className="font-semibold text-white">DevFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-xs text-zinc-400 mb-8">Enter your credentials to access your workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-lg border border-[#2c2c34] bg-[#151519] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-[#2c2c34] bg-[#151519] pl-10 pr-11 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-white font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
