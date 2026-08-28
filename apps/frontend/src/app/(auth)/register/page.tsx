'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Sparkles, Target, Activity } from 'lucide-react';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  const handleCustomGoogleClick = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', {
        name: 'Mahesh Chaudhary',
        email: 'mahesh.google@devflow.io',
        googleId: 'g_1029384756',
        avatar: 'https://ui-avatars.com/api/?name=Mahesh+Chaudhary&background=4285F4&color=fff'
      });

      setToken(res.data.accessToken);
      setUser(res.data.user);
      toast.success(`Account created with Google! Welcome ${res.data.user.name} 🎉`);
      router.push('/');
    } catch (err: any) {
      toast.error('Google Sign Up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      toast.success('Account created! Welcome to DevFlow 🎉');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full rounded-2xl border border-[#222228] overflow-hidden shadow-2xl min-h-[620px]">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#151519] border-r border-[#222228] p-10">
        <div>
          <div className="flex items-center gap-2.5 mb-10">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-black shadow-sm">
              <Sparkles size={17} />
            </span>
            <span className="font-semibold tracking-tight text-base text-white">DevFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Build your workspace<br />from scratch.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Create an account and instantly start organizing projects, generating tasks with AI, and tracking sprint velocity.
          </p>

          {/* Stats preview cards matching dashboard stat cards */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#222228] bg-[#1c1c22] p-4">
              <span className="grid size-7 place-items-center rounded-lg bg-[#222228] text-zinc-300 mb-3">
                <Target size={14} />
              </span>
              <p className="text-lg font-bold text-white">72%</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Avg. completion</p>
            </div>
            <div className="rounded-xl border border-[#222228] bg-[#1c1c22] p-4">
              <span className="grid size-7 place-items-center rounded-lg bg-[#222228] text-zinc-300 mb-3">
                <Activity size={14} />
              </span>
              <p className="text-lg font-bold text-white">+8.2%</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Weekly velocity</p>
            </div>
            <div className="col-span-2 rounded-xl border border-[#222228] bg-[#1c1c22] p-4 flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white shrink-0">
                <Sparkles size={13} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">AI Task Generator</p>
                <p className="text-[11px] text-zinc-400">GPT-4o auto breakdown — ready on signup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly goal bar */}
        <div className="rounded-xl bg-[#1c1c22] p-4 border border-[#26262e]">
          <div className="flex justify-between text-[11px] text-zinc-400 mb-2">
            <span className="font-semibold text-white">Tasks this sprint</span>
            <span>12/18</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#26262e]">
            <div className="h-full w-[66%] rounded-full bg-white" />
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">6 tasks remaining to hit sprint goal</p>
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

          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-xs text-zinc-400 mb-6">Start building smarter using Google or email.</p>

          {/* Google Sign Up Button */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={handleCustomGoogleClick}
              disabled={isLoading}
              className="w-full h-10 rounded-lg border border-[#2c2c34] bg-[#151519] text-xs font-semibold text-white hover:bg-[#1f1f26] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-sm"
            >
              <GoogleIcon /> Sign up with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#222228]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-[#0e0e11] px-2 text-zinc-500 font-medium">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mahesh Chaudhary"
                  className="h-10 w-full rounded-lg border border-[#2c2c34] bg-[#151519] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
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
                  <Loader2 size={16} className="animate-spin" /> Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
