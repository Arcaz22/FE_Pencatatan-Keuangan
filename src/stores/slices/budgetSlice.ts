import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetApi } from '@/lib/api-client';
import type { Budget, QueryParams, BudgetFormValues, Meta } from '@/types/api';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  pagination: Meta;
}

const initialState: BudgetState = {
  budgets: [],
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 5,
    total_pages: 0,
    total_records: 0
  }
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetchAll',
  async (params: QueryParams, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to fetch budget data');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budget/create',
  async (data: BudgetFormValues, { rejectWithValue }) => {
    try {
      const response = await budgetApi.create(data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to create budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/update',
  async ({ id, data }: { id: string; data: Partial<BudgetFormValues> }, { rejectWithValue }) => {
    try {
      const response = await budgetApi.update(id, data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetApi.delete(id);
      return {
        id,
        message: 'Budget deleted successfully'
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to delete budget');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.budgets = [];
      state.pagination = initialState.pagination;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.budgets = state.budgets.filter((cat) => cat.id !== action.payload.id);

        if (state.pagination.total_records > 0) {
          state.pagination.total_records -= 1;
        }

        const totalPages = Math.ceil(state.pagination.total_records / state.pagination.per_page);
        state.pagination.total_pages = Math.max(1, totalPages);

        if (state.pagination.current_page > state.pagination.total_pages) {
          state.pagination.current_page = state.pagination.total_pages;
        }
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearCategories } = budgetSlice.actions;
export default budgetSlice.reducer;

export const selectBudgets = (state: { budget: BudgetState }) => state.budget.budgets;
export const selectBudgetLoading = (state: { budget: BudgetState }) => state.budget.isLoading;
export const selectBudgetError = (state: { budget: BudgetState }) => state.budget.error;
export const selectBudgetPagination = (state: { budget: BudgetState }) => state.budget.pagination;
