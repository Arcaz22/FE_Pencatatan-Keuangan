import {
  ApiResponse,
  LoginInput,
  RegisterInput,
  User,
  LoginValues,
  RegisterValues,
  Category,
  CategoryQueryParams,
  QueryParams,
  Income,
  Expense,
  Budget
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
  get: async <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = new URL(`${API_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
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
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      try {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Delete request failed');
      } catch {
        throw new Error(`Delete request failed with status ${response.status}`);
      }
    }

    if (response.status === 204) {
      return { success: true } as T;
    }

    try {
      return response.json();
    } catch {
      return {} as T;
    }
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

export const categoryApi = {
  getAll: async (params?: CategoryQueryParams): Promise<ApiResponse<Category[]>> => {
    return api.get<ApiResponse<Category[]>>('/categories/all', params);
  },

  create: async (data: Omit<Category, 'id'>): Promise<ApiResponse<Category>> => {
    return api.post<ApiResponse<Category>>('/categories/create', data);
  },

  update: async (
    id: string,
    data: Partial<Omit<Category, 'id'>>
  ): Promise<ApiResponse<Category>> => {
    return api.put<ApiResponse<Category>>(`/categories/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/categories/${id}`);
  }
};

export const incomeApi = {
  getAll: async (params?: QueryParams): Promise<ApiResponse<Income[]>> => {
    return api.get<ApiResponse<Income[]>>('/incomes/all', params);
  },

  create: async (data: Omit<Income, 'id'>): Promise<ApiResponse<Income>> => {
    return api.post<ApiResponse<Income>>('/incomes/create', data);
  },

  update: async (id: string, data: Partial<Omit<Income, 'id'>>): Promise<ApiResponse<Income>> => {
    return api.put<ApiResponse<Income>>(`/incomes/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/incomes/${id}`);
  }
};

export const expenseApi = {
  getAll: async (params?: QueryParams): Promise<ApiResponse<Expense[]>> => {
    return api.get<ApiResponse<Expense[]>>('/expenses/all', params);
  },

  create: async (data: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> => {
    return api.post<ApiResponse<Expense>>('/expenses/create', data);
  },

  update: async (id: string, data: Partial<Omit<Expense, 'id'>>): Promise<ApiResponse<Expense>> => {
    return api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/expenses/${id}`);
  }
};

export const budgetApi = {
  getAll: async (params?: QueryParams): Promise<ApiResponse<Budget[]>> => {
    return api.get<ApiResponse<Budget[]>>('/budgets/all', params);
  },

  create: async (data: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> => {
    return api.post<ApiResponse<Budget>>('/budgets/create', data);
  },

  update: async (id: string, data: Partial<Omit<Budget, 'id'>>): Promise<ApiResponse<Budget>> => {
    return api.put<ApiResponse<Budget>>(`/budgets/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/budgets/${id}`);
  }
};
