import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task } from '@/types';
import toast from 'react-hot-toast';

export function useTasks(filters?: any) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.projectId) params.append('projectId', filters.projectId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);
      
      const { data } = await api.get(`/tasks?${params.toString()}`);
      return (data.tasks || []) as Task[];
    },
    enabled: filters?.projectId !== undefined ? !!filters.projectId : true,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${id}`);
      return data.task as Task;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      const { data } = await api.post('/tasks', taskData);
      return data.task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.project] });
      toast.success('Task created');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Task> & { id: string }) => {
      const { data } = await api.patch(`/tasks/${id}`, updateData);
      return data.task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (data?.project) {
        queryClient.invalidateQueries({ queryKey: ['projects', data.project] });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ updates }: { projectId?: string; updates: { id: string; order: number }[] }) => {
      const { data } = await api.post('/tasks/reorder', { updates });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reorder tasks');
    },
  });
}
