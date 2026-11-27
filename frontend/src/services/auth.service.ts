import { api } from '@/lib/api';
import type { User } from '@/types/user';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: User }>('/api/auth/login', { email, password }),
  logout: () => api.post<null>('/api/auth/logout'),
  me: () => api.get<{ user: User }>('/api/auth/me'),
};
