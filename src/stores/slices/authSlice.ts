import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api-client';
import type { User, RegisterInput, LoginInput } from '@/types/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
};

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return {
        user: response.user,
        message: response.message || 'Registrasi berhasil'
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Registrasi gagal');
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      return {
        user: response.user,
        message: response.message || 'Login berhasil'
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Login gagal');
    }
  }
);

// Get user profile thunk
export const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getUser();
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Gagal mengambil data user');
  }
});

// Logout thunk
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.logout();
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Logout gagal');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get user cases
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;
