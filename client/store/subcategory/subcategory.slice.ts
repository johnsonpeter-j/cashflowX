import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "./subcategory.thunk";
import { SubCategoryState, SubCategory } from "./subcategory.types";

// Initial state
const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  createSubCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getAllSubCategoriesApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getSubCategoryByIdApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  updateSubCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  deleteSubCategoryApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
};

// SubCategory slice
const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {
    clearCreateSubCategoryError: (state) => {
      state.createSubCategoryApiState.error = null;
    },
    clearGetAllSubCategoriesError: (state) => {
      state.getAllSubCategoriesApiState.error = null;
    },
    clearGetSubCategoryByIdError: (state) => {
      state.getSubCategoryByIdApiState.error = null;
    },
    clearUpdateSubCategoryError: (state) => {
      state.updateSubCategoryApiState.error = null;
    },
    clearDeleteSubCategoryError: (state) => {
      state.deleteSubCategoryApiState.error = null;
    },
    setSelectedSubCategory: (state, action: PayloadAction<SubCategory | null>) => {
      state.selectedSubCategory = action.payload;
    },
    clearSelectedSubCategory: (state) => {
      state.selectedSubCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Create SubCategory
    builder
      .addCase(createSubCategory.pending, (state) => {
        state.createSubCategoryApiState.isLoading = true;
        state.createSubCategoryApiState.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.createSubCategoryApiState.isLoading = false;
        state.createSubCategoryApiState.lastFetched = Date.now();
        state.subCategories.unshift(action.payload); // Add to beginning of array
        state.createSubCategoryApiState.error = null;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.createSubCategoryApiState.isLoading = false;
        state.createSubCategoryApiState.error = action.payload as string;
      });

    // Get All SubCategories
    builder
      .addCase(getAllSubCategories.pending, (state) => {
        state.getAllSubCategoriesApiState.isLoading = true;
        state.getAllSubCategoriesApiState.error = null;
      })
      .addCase(getAllSubCategories.fulfilled, (state, action) => {
        state.getAllSubCategoriesApiState.isLoading = false;
        state.getAllSubCategoriesApiState.lastFetched = Date.now();
        state.subCategories = action.payload;
        state.getAllSubCategoriesApiState.error = null;
      })
      .addCase(getAllSubCategories.rejected, (state, action) => {
        state.getAllSubCategoriesApiState.isLoading = false;
        state.getAllSubCategoriesApiState.error = action.payload as string;
      });

    // Get SubCategory By ID
    builder
      .addCase(getSubCategoryById.pending, (state) => {
        state.getSubCategoryByIdApiState.isLoading = true;
        state.getSubCategoryByIdApiState.error = null;
      })
      .addCase(getSubCategoryById.fulfilled, (state, action) => {
        state.getSubCategoryByIdApiState.isLoading = false;
        state.getSubCategoryByIdApiState.lastFetched = Date.now();
        state.selectedSubCategory = action.payload;
        state.getSubCategoryByIdApiState.error = null;
        // Update subcategory in list if it exists
        const index = state.subCategories.findIndex(sub => sub._id === action.payload._id);
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
      })
      .addCase(getSubCategoryById.rejected, (state, action) => {
        state.getSubCategoryByIdApiState.isLoading = false;
        state.getSubCategoryByIdApiState.error = action.payload as string;
      });

    // Update SubCategory
    builder
      .addCase(updateSubCategory.pending, (state) => {
        state.updateSubCategoryApiState.isLoading = true;
        state.updateSubCategoryApiState.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.updateSubCategoryApiState.isLoading = false;
        state.updateSubCategoryApiState.lastFetched = Date.now();
        const index = state.subCategories.findIndex(sub => sub._id === action.payload._id);
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
        // Update selected subcategory if it's the one being updated
        if (state.selectedSubCategory && state.selectedSubCategory._id === action.payload._id) {
          state.selectedSubCategory = action.payload;
        }
        state.updateSubCategoryApiState.error = null;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.updateSubCategoryApiState.isLoading = false;
        state.updateSubCategoryApiState.error = action.payload as string;
      });

    // Delete SubCategory
    builder
      .addCase(deleteSubCategory.pending, (state) => {
        state.deleteSubCategoryApiState.isLoading = true;
        state.deleteSubCategoryApiState.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.deleteSubCategoryApiState.isLoading = false;
        state.deleteSubCategoryApiState.lastFetched = Date.now();
        state.subCategories = state.subCategories.filter(sub => sub._id !== action.payload);
        // Clear selected subcategory if it was deleted
        if (state.selectedSubCategory && state.selectedSubCategory._id === action.payload) {
          state.selectedSubCategory = null;
        }
        state.deleteSubCategoryApiState.error = null;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.deleteSubCategoryApiState.isLoading = false;
        state.deleteSubCategoryApiState.error = action.payload as string;
      });
  },
});

export const { 
  clearCreateSubCategoryError,
  clearGetAllSubCategoriesError,
  clearGetSubCategoryByIdError,
  clearUpdateSubCategoryError,
  clearDeleteSubCategoryError,
  setSelectedSubCategory, 
  clearSelectedSubCategory 
} = subCategorySlice.actions;
export default subCategorySlice.reducer;


