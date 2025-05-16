import { AuthResponse, LoginInput, RegisterInput, User } from '@/types/api';

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Test User'
};

type ApiResponse<T> = { data: T };

// Mock API implementation
export const api = {
  get: async (url: string): Promise<ApiResponse<User>> => {
    // Log URL to avoid unused parameter warning
    console.log('GET request to:', url);
    return {
      data: mockUser
    };
  },
  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    console.log('POST request to:', url, 'with data:', data);
    return {
      data: { user: mockUser } as T
    };
  }
};

export const authApi = {
  getUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post<void>('/auth/logout');
  }
};
