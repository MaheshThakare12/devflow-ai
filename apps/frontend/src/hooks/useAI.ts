import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSuggestTasks() {
  return useMutation({
    mutationFn: async (data: { projectTitle: string; projectDescription?: string; count?: number }) => {
      const res = await api.post('/ai/suggest-tasks', data);
      return res.data.tasks || [];
    },
  });
}

export function useEnhanceTask() {
  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const res = await api.post('/ai/enhance-task', data);
      return res.data.task || null;
    },
  });
}

