import { createSlice } from '@reduxjs/toolkit';
import { Category } from '@/types/api';
import {
  createCategoryThunk,
  getAllCategoriesThunk,
  getCategoryByIdThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from './category.thunk';

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.unshift(action.payload.category); // Add to beginning
        state.totalCount += 1;
        state.currentCategory = action.payload.category;
        state.error = null;
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create category';
      });

    // Get All Categories
    builder
      .addCase(getAllCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(getAllCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });

    // Get Category By ID
    builder
      .addCase(getCategoryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.category;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch category';
      });

    // Update Category
    builder
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCategory = action.payload.category;
        // Update in categories array
        const index = state.categories.findIndex(
          (cat) => cat._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
        // Update current category if it's the same
        if (state.currentCategory?._id === updatedCategory._id) {
          state.currentCategory = updatedCategory;
        }
        state.error = null;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update category';
      });

    // Delete Category
    builder
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove from categories array using the category ID from the thunk argument
        const deletedCategoryId = action.meta.arg;
        state.categories = state.categories.filter(
          (cat) => cat._id !== deletedCategoryId
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
        // Clear current category if it was the deleted one
        if (state.currentCategory?._id === deletedCategoryId) {
          state.currentCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete category';
      });
  },
});

export const { clearCurrentCategory, clearError, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;

