import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incomeApi } from '@/lib/api-client';
import type { Income, QueryParams, IncomeFormValues, Meta } from '@/types/api';

interface IncomeState {
  incomes: Income[];
  isLoading: boolean;
  error: string | null;
  pagination: Meta;
}

const initialState: IncomeState = {
  incomes: [],
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 5,
    total_pages: 0,
    total_records: 0
  }
};
export const fetchIncomes = createAsyncThunk(
  'income/fetchAll',
  async (params: QueryParams, { rejectWithValue }) => {
    try {
      const response = await incomeApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to fetch income data');
    }
  }
);

export const createIncome = createAsyncThunk(
  'income/create',
  async (data: IncomeFormValues, { rejectWithValue }) => {
    try {
      const response = await incomeApi.create(data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to create income');
    }
  }
);

export const updateIncome = createAsyncThunk(
  'income/update',
  async ({ id, data }: { id: string; data: Partial<IncomeFormValues> }, { rejectWithValue }) => {
    try {
      const response = await incomeApi.update(id, data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update income');
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await incomeApi.delete(id);
      return {
        id,
        message: 'Income berhasil dihapus'
      };
    } catch (err) {
      console.error('Error deleting income:', err);

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Gagal menghapus pendapatan');
    }
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.incomes = [];
      state.pagination = initialState.pagination;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createIncome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createIncome.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateIncome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIncome.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.incomes = state.incomes.filter((cat) => cat.id !== action.payload.id);

        if (state.pagination.total_records > 0) {
          state.pagination.total_records -= 1;
        }

        const totalPages = Math.ceil(state.pagination.total_records / state.pagination.per_page);
        state.pagination.total_pages = Math.max(1, totalPages);

        if (state.pagination.current_page > state.pagination.total_pages) {
          state.pagination.current_page = state.pagination.total_pages;
        }
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearCategories } = incomeSlice.actions;
export default incomeSlice.reducer;

export const selectIncomes = (state: { income: IncomeState }) => state.income.incomes;
export const selectIncomeLoading = (state: { income: IncomeState }) => state.income.isLoading;
export const selectIncomeError = (state: { income: IncomeState }) => state.income.error;
export const selectIncomePagination = (state: { income: IncomeState }) => state.income.pagination;
