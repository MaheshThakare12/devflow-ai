'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export function RegisterForm() {
  const [name, setName] = useState('');
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
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User className="w-5 h-5" />}
        placeholder="John Doe"
      />

      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-5 h-5" />}
        placeholder="you@example.com"
      />
      
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-slate-400 hover:text-white"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
        Create Account
      </Button>
      
      <p className="text-center text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary-foreground font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
