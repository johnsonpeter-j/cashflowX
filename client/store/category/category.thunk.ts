import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { showToast } from "@/utils/toast";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoriesResponse,
  DeleteCategoryResponse,
} from "./category.types";

// Create category thunk
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<CategoryResponse>('/api/category', categoryData);
      
      if (response.data.success) {
        showToast.success('Category created successfully');
        return response.data.data.category;
      } else {
        const errorMsg = response.data.message || 'Failed to create category';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while creating category';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get all categories thunk
export const getAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoriesResponse>('/api/category');
      
      if (response.data.success) {
        return response.data.data.categories;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch categories';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching categories';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get category by ID thunk
export const getCategoryById = createAsyncThunk(
  'category/getCategoryById',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoryResponse>(`/api/category/${categoryId}`);
      
      if (response.data.success) {
        return response.data.data.category;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch category';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching category';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update category thunk
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: string; data: UpdateCategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await api.put<CategoryResponse>(`/api/category/${id}`, data);
      
      if (response.data.success) {
        showToast.success('Category updated successfully');
        return response.data.data.category;
      } else {
        const errorMsg = response.data.message || 'Failed to update category';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while updating category';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete category thunk
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<DeleteCategoryResponse>(`/api/category/${categoryId}`);
      
      if (response.data.success) {
        showToast.success('Category deleted successfully');
        return categoryId;
      } else {
        const errorMsg = response.data.message || 'Failed to delete category';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while deleting category';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

