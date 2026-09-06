export interface User { 
  _id: string; 
  name: string; 
  email: string; 
  avatar?: string; 
  role: string; 
  createdAt: string; 
}

export interface Project { 
  _id: string; 
  title: string; 
  description?: string; 
  owner: User; 
  members: User[]; 
  status: 'active' | 'archived'; 
  color: string; 
  emoji?: string; 
  taskCount?: number; 
  createdAt: string; 
  updatedAt: string; 
}

export interface Task { 
  _id: string; 
  title: string; 
  description?: string; 
  project: string | Project; 
  assignee?: User; 
  createdBy: User; 
  status: 'todo' | 'in-progress' | 'done'; 
  priority: 'low' | 'medium' | 'high' | 'urgent'; 
  dueDate?: string; 
  tags: string[]; 
  order: number; 
  createdAt: string; 
  updatedAt: string; 
}

export interface ApiResponse<T> { 
  success: boolean; 
  data: T; 
  message?: string; 
}

export interface AuthState { 
  user: User | null; 
  accessToken: string | null; 
  isLoading: boolean; 
  isInitialized: boolean;
  setUser: (user: User | null) => void; 
  setToken: (token: string | null) => void; 
  logout: () => void; 
  initialize: () => Promise<void>;
}
