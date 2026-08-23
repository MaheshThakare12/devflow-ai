'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <Avatar name={user.name} size="xl" className="border-4 border-background shadow-xl" />
          <div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-slate-400 mb-2">{user.email}</p>
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
              {user.role}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" defaultValue={user.name} disabled />
            <Input label="Email Address" defaultValue={user.email} disabled />
            <Input label="Member Since" defaultValue={formatDate(user.createdAt)} disabled />
          </div>
        </div>
      </Card>

      <Card className="p-8 border-danger/20 bg-danger/5">
        <h3 className="text-lg font-semibold text-danger mb-4">Danger Zone</h3>
        <p className="text-slate-400 mb-6">Once you logout, you will need to sign in again to access your projects.</p>
        <Button variant="destructive" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </Card>
    </div>
  );
}
