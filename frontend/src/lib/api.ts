import axios from 'axios';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface Task {
  id: string;      // For frontend use
  _id: string;     // From MongoDB
  title: string;
  projectId?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'pending' | 'finished';
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  projectId?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  startTime: Date;
  endTime: Date;
}

export interface UpdateTaskInput {
  title?: string;
  projectId?: string;
  priority?: 1 | 2 | 3 | 4 | 5;
  status?: 'pending' | 'finished';
  startTime?: Date;
  endTime?: Date | string; // Can be either estimated or actual completion time
  userId?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskStats {
  overview: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completedPercentage: number;
    pendingPercentage: number;
    averageTime: number;
  };
  timeMetrics: {
    averageCompletionTime: number;
    totalTimeElapsed: number;
    totalTimeToFinish: number;
    pendingTasksByPriority: Array<{
      priority: number;
      count: number;
      timeElapsed: number;
      estimatedTimeLeft: number;
    }>;
  };
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token in cookie
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 30 });
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', { 
        email, 
        password,
        confirmPassword: password 
      });
      
      // Store token in cookie
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 30 });
      }
      
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
};

export type AdminUser = {
  _id: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
};

export const admin = {
  listUsers: async () => {
    const response = await api.get<{ users: AdminUser[] }>('/admin/users');
    return response.data;
  }
};

export type Project = {
  _id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export const projects = {
  getAll: async () => {
    const response = await api.get<{ projects: Project[] }>('/projects');
    return response.data;
  },
  create: async (name: string) => {
    const response = await api.post<Project>('/projects', { name });
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  }
};

// Add utility functions for time calculations
export const calculateTaskTimes = (task: Task) => {
  const now = new Date();
  const startTime = new Date(task.startTime);
  const endTime = new Date(task.endTime);
  
  // Calculate total time (actual or estimated)
  const totalTime = Math.max(0, endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours

  if (task.status === 'finished') {
    return { totalTime, timeElapsed: totalTime, timeLeft: 0 };
  }

  // For pending tasks
  // Calculate time elapsed (current - start), 0 if task hasn't started
  const timeElapsed = Math.max(0, now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  // Calculate time left (end - current), 0 if past deadline
  const timeLeft = Math.max(0, endTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return { totalTime, timeElapsed, timeLeft };
};

// Add validation function
export const validateTaskTimes = (startTime: Date, endTime: Date) => {
  if (startTime >= endTime) {
    throw new Error('End time must be after start time');
  }
};

// Tasks API
export const tasks = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    priority?: number;
    status?: string;
    projectId?: string;
    field?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get<TasksResponse>('/tasks', { params });
    return response.data;
  },

  create: async (task: CreateTaskInput) => {
    try {
      validateTaskTimes(task.startTime, task.endTime);
      
      const response = await api.post<Task>('/tasks', {
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime.toISOString()
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create task');
    }
  },

  update: async (taskId: string, task: UpdateTaskInput) => {
    try {
      const updateData: UpdateTaskInput = {
        title: task.title,
        projectId: task.projectId,
        priority: task.priority,
        status: task.status as 'pending' | 'finished' | undefined,
        startTime: task.startTime ? new Date(task.startTime) : undefined,
      };

      // Validate times if both are provided
      if (task.startTime && task.endTime) {
        validateTaskTimes(
          new Date(task.startTime),
          new Date(task.endTime)
        );
      }

      // If task is being marked as finished, set endTime to current time
      if (task.status === 'finished') {
        updateData.endTime = new Date();
      } else if (task.endTime) {
        updateData.endTime = new Date(task.endTime);
      }

      const response = await api.patch<Task>(`/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update task');
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    const response = await api.get<TaskStats>('/tasks/stats');
    return response.data;
  }
};
