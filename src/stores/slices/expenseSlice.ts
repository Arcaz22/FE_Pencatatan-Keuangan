import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseApi } from '@/lib/api-client';
import type { Expense, QueryParams, ExpenseFormValues, Meta } from '@/types/api';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  pagination: Meta;
}

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 5,
    total_pages: 0,
    total_records: 0
  }
};
export const fetchExpenses = createAsyncThunk(
  'expense/fetchAll',
  async (params: QueryParams, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to fetch expense data');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expense/create',
  async (data: ExpenseFormValues, { rejectWithValue }) => {
    try {
      const response = await expenseApi.create(data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expense/update',
  async ({ id, data }: { id: string; data: Partial<ExpenseFormValues> }, { rejectWithValue }) => {
    try {
      const response = await expenseApi.update(id, data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await expenseApi.delete(id);
      return {
        id,
        message: 'Expense berhasil dihapus'
      };
    } catch (err) {
      console.error('Error deleting expense:', err);

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Gagal menghapus pendapatan');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.expenses = [];
      state.pagination = initialState.pagination;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.expenses = state.expenses.filter((cat) => cat.id !== action.payload.id);

        if (state.pagination.total_records > 0) {
          state.pagination.total_records -= 1;
        }

        const totalPages = Math.ceil(state.pagination.total_records / state.pagination.per_page);
        state.pagination.total_pages = Math.max(1, totalPages);

        if (state.pagination.current_page > state.pagination.total_pages) {
          state.pagination.current_page = state.pagination.total_pages;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearCategories } = expenseSlice.actions;
export default expenseSlice.reducer;

export const selectExpenses = (state: { expense: ExpenseState }) => state.expense.expenses;
export const selectExpenseLoading = (state: { expense: ExpenseState }) => state.expense.isLoading;
export const selectExpenseError = (state: { expense: ExpenseState }) => state.expense.error;
export const selectExpensePagination = (state: { expense: ExpenseState }) =>
  state.expense.pagination;
