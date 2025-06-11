import { AuthResponse, LoginInput, RegisterInput, User } from '@/types/api';
import { env } from '@/config/env';

const API_URL = env.apiUrl;

// const mockUser: User = {
//   id: '1',
//   email: 'user@example.com',
//   name: 'Test User'
// };

// type ApiResponse<T> = { data: T };

// export const api = {
//   get: async (url: string): Promise<ApiResponse<User>> => {
//     // Log URL to avoid unused parameter warning
//     console.log('GET request to:', url);
//     return {
//       data: mockUser
//     };
//   },
//   post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
//     console.log('POST request to:', url, 'with data:', data);
//     return {
//       data: { user: mockUser } as T
//     };
//   }
// };

// export const authApi = {
//   getUser: async (): Promise<User> => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },

//   login: async (data: LoginInput): Promise<AuthResponse> => {
//     const response = await api.post<AuthResponse>('/auth/login', data);
//     return response.data;
//   },

//   register: async (data: RegisterInput): Promise<AuthResponse> => {
//     const response = await api.post<AuthResponse>('/auth/register', data);
//     return response.data;
//   },

//   logout: async (): Promise<void> => {
//     await api.post<void>('/auth/logout');
//   }
// };

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/users/register', data);
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/users/login', data);
  },

  getUser: async (): Promise<User> => {
    return api.get<User>('/users/me');
  },

  logout: async (): Promise<void> => {
    return api.post<void>('/users/logout');
  }
};
