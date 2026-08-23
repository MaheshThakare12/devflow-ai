import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: true,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ accessToken: token }),
      logout: () => {
        set({ user: null, accessToken: null });
        api.post('/auth/logout').catch(console.error);
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
      },
      initialize: async () => {
        try {
          if (get().accessToken) {
            const res = await api.get('/auth/me');
            set({ user: res.data.user, isInitialized: true, isLoading: false });
          } else {
             set({ isInitialized: true, isLoading: false });
          }
        } catch (error) {
          set({ user: null, accessToken: null, isInitialized: true, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
