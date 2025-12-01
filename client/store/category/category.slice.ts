import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.thunk";
import { CategoryState, Category } from "./category.types";

// Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  createCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getAllCategoriesApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getCategoryByIdApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  updateCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  deleteCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
};

// Category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCreateCategoryError: (state) => {
      state.createCategoryApiState.error = null;
    },
    clearGetAllCategoriesError: (state) => {
      state.getAllCategoriesApiState.error = null;
    },
    clearGetCategoryByIdError: (state) => {
      state.getCategoryByIdApiState.error = null;
    },
    clearUpdateCategoryError: (state) => {
      state.updateCategoryApiState.error = null;
    },
    clearDeleteCategoryError: (state) => {
      state.deleteCategoryApiState.error = null;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.createCategoryApiState.isLoading = true;
        state.createCategoryApiState.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createCategoryApiState.isLoading = false;
        state.createCategoryApiState.lastFetched = Date.now();
        state.categories.unshift(action.payload); // Add to beginning of array
        state.createCategoryApiState.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createCategoryApiState.isLoading = false;
        state.createCategoryApiState.error = action.payload as string;
      });

    // Get All Categories
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.getAllCategoriesApiState.isLoading = true;
        state.getAllCategoriesApiState.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesApiState.isLoading = false;
        state.getAllCategoriesApiState.lastFetched = Date.now();
        state.categories = action.payload;
        state.getAllCategoriesApiState.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.getAllCategoriesApiState.isLoading = false;
        state.getAllCategoriesApiState.error = action.payload as string;
      });

    // Get Category By ID
    builder
      .addCase(getCategoryById.pending, (state) => {
        state.getCategoryByIdApiState.isLoading = true;
        state.getCategoryByIdApiState.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.getCategoryByIdApiState.isLoading = false;
        state.getCategoryByIdApiState.lastFetched = Date.now();
        state.selectedCategory = action.payload;
        state.getCategoryByIdApiState.error = null;
        // Update category in list if it exists
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.getCategoryByIdApiState.isLoading = false;
        state.getCategoryByIdApiState.error = action.payload as string;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.updateCategoryApiState.isLoading = true;
        state.updateCategoryApiState.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateCategoryApiState.isLoading = false;
        state.updateCategoryApiState.lastFetched = Date.now();
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        // Update selected category if it's the one being updated
        if (state.selectedCategory && state.selectedCategory._id === action.payload._id) {
          state.selectedCategory = action.payload;
        }
        state.updateCategoryApiState.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateCategoryApiState.isLoading = false;
        state.updateCategoryApiState.error = action.payload as string;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.deleteCategoryApiState.isLoading = true;
        state.deleteCategoryApiState.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteCategoryApiState.isLoading = false;
        state.deleteCategoryApiState.lastFetched = Date.now();
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
        // Clear selected category if it was deleted
        if (state.selectedCategory && state.selectedCategory._id === action.payload) {
          state.selectedCategory = null;
        }
        state.deleteCategoryApiState.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteCategoryApiState.isLoading = false;
        state.deleteCategoryApiState.error = action.payload as string;
      });
  },
});

export const { 
  clearCreateCategoryError,
  clearGetAllCategoriesError,
  clearGetCategoryByIdError,
  clearUpdateCategoryError,
  clearDeleteCategoryError,
  setSelectedCategory, 
  clearSelectedCategory 
} = categorySlice.actions;
export default categorySlice.reducer;


