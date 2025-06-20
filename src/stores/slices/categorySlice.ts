import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '@/lib/api-client';
import type { Category, CategoryQueryParams, CategoryFormValues, Meta } from '@/types/api';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  pagination: Meta;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 5,
    total_pages: 0,
    total_records: 0
  }
};

export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (params: CategoryQueryParams, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Gagal mengambil data kategori');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/create',
  async (data: CategoryFormValues, { rejectWithValue }) => {
    try {
      const response = await categoryApi.create(data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Gagal membuat kategori');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, data }: { id: string; data: CategoryFormValues }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.update(id, data);
      return {
        data: response.data,
        message: response.message
      };
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Gagal mengupdate kategori');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      // Call the API - now returns void for 204 response
      await categoryApi.delete(id);

      // Return success object since API call succeeded
      return {
        id,
        message: 'Kategori berhasil dihapus'
      };
    } catch (err) {
      console.error('Error deleting category:', err);

      // Handle errors
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Gagal menghapus kategori');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.pagination = initialState.pagination;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.categories = state.categories.filter((cat) => cat.id !== action.payload.id);

        if (state.pagination.total_records > 0) {
          state.pagination.total_records -= 1;
        }

        const totalPages = Math.ceil(state.pagination.total_records / state.pagination.per_page);
        state.pagination.total_pages = Math.max(1, totalPages);

        if (state.pagination.current_page > state.pagination.total_pages) {
          state.pagination.current_page = state.pagination.total_pages;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;

export const selectCategories = (state: { category: CategoryState }) => state.category.categories;
export const selectCategoryLoading = (state: { category: CategoryState }) =>
  state.category.isLoading;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;
export const selectCategoryPagination = (state: { category: CategoryState }) =>
  state.category.pagination;
