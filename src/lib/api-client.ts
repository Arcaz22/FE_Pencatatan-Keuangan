import {
  ApiResponse,
  LoginInput,
  RegisterInput,
  User,
  LoginValues,
  RegisterValues
} from '@/types/api';
import { env } from '@/config/env';

const API_URL = env.apiUrl;

export const getToken = () => localStorage.getItem('auth_token');

export const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  }
};

export const authApi = {
  register: async (data: RegisterInput): Promise<ApiResponse<RegisterValues>> => {
    return api.post<ApiResponse<RegisterValues>>('/users/register', data);
  },

  login: async (data: LoginInput): Promise<ApiResponse<LoginValues>> => {
    const response = await api.post<ApiResponse<LoginValues>>('/users/signin', data);

    if (response.data.token) {
      setToken(response.data.token);
    }

    return response;
  },

  getUser: async (): Promise<ApiResponse<User>> => {
    return api.get<ApiResponse<User>>('/users/profile');
  },

  logout: async (): Promise<void> => {
    try {
      await api.post<{ message: string }>('/users/logout');
    } catch (error) {
      console.warn('Logout API failed, clearing token locally:', error);
    } finally {
      removeToken();
    }
  }
};
