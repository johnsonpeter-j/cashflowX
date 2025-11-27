import { API_BASE_URL, ApiResponse, Category, CategoryResponse, CategoriesResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Get token from state helper
const getToken = (state: RootState): string | null => {
  return state.auth.token;
};

// Create Category Thunk
export const createCategoryThunk = createAsyncThunk<
  CategoryResponse,
  CreateCategoryRequest,
  { rejectValue: string; state: RootState }
>('category/createCategory', async (data, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to create category');
    }

    if (!result.data || !result.data.category) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Create category error:', error);
    return rejectWithValue(
      'An error occurred while creating category. Please check your connection and try again.'
    );
  }
});

// Get All Categories Thunk
export const getAllCategoriesThunk = createAsyncThunk<
  CategoriesResponse,
  void,
  { rejectValue: string; state: RootState }
>('category/getAllCategories', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to fetch categories');
    }

    if (!result.data || !result.data.categories) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Get all categories error:', error);
    return rejectWithValue(
      'An error occurred while fetching categories. Please check your connection and try again.'
    );
  }
});

// Get Category By ID Thunk
export const getCategoryByIdThunk = createAsyncThunk<
  CategoryResponse,
  string,
  { rejectValue: string; state: RootState }
>('category/getCategoryById', async (id, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to fetch category');
    }

    if (!result.data || !result.data.category) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Get category by ID error:', error);
    return rejectWithValue(
      'An error occurred while fetching category. Please check your connection and try again.'
    );
  }
});

// Update Category Thunk
export const updateCategoryThunk = createAsyncThunk<
  CategoryResponse,
  { id: string; data: UpdateCategoryRequest },
  { rejectValue: string; state: RootState }
>('category/updateCategory', async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to update category');
    }

    if (!result.data || !result.data.category) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Update category error:', error);
    return rejectWithValue(
      'An error occurred while updating category. Please check your connection and try again.'
    );
  }
});

// Delete Category Thunk
export const deleteCategoryThunk = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: string; state: RootState }
>('category/deleteCategory', async (id, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to delete category');
    }

    return {
      success: true,
      message: result.message || 'Category deleted successfully',
    };
  } catch (error) {
    console.error('Delete category error:', error);
    return rejectWithValue(
      'An error occurred while deleting category. Please check your connection and try again.'
    );
  }
});

