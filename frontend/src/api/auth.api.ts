import api from '@/lib/axios';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
