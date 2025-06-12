import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api-client';
import { getToken, removeToken } from '@/lib/api-client';
import type { User, RegisterInput, LoginInput } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Use the imported getToken function
const storedToken = getToken();

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isLoading: false,
  error: null
};

// Register thunk (doesn't change - no token involved)
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return {
        user: response.data.user,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Registrasi gagal');
    }
  }
);

// Login thunk - no need to manually save token as authApi.login already does it
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      // Token is already saved by authApi.login
      return {
        user: response.data.user,
        token: response.data.token,
        message: response.message
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
    // Use the helper function
    const token = getToken();
    if (!token) {
      return rejectWithValue('No token found');
    }

    const response = await authApi.getUser();
    return {
      user: response.data,
      token: token
    };
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Gagal mengambil data user');
  }
});

// Logout thunk - no need to manually remove token as authApi.logout already does it
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.logout();
    // Token is already removed by authApi.logout
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
      state.token = null;
      removeToken(); // Use the helper function
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases (no change)
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
        state.token = action.payload.token;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear auth state on rejection
        state.user = null;
        state.token = null;
        // Use the helper function
        removeToken();
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Even on failed logout, clear the state
        // state.user = null;
        // state.token = null;
        // removeToken(); // Use the helper function
      });
  }
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;
