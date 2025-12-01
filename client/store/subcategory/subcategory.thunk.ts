import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { showToast } from "@/utils/toast";
import {
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  GetAllSubCategoriesParams,
  SubCategoryResponse,
  SubCategoriesResponse,
  DeleteSubCategoryResponse,
} from "./subcategory.types";

// Create subcategory thunk
export const createSubCategory = createAsyncThunk(
  'subcategory/createSubCategory',
  async (subCategoryData: CreateSubCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<SubCategoryResponse>('/api/sub-category', subCategoryData);
      
      if (response.data.success) {
        showToast.success('Subcategory created successfully');
        return response.data.data.subCategory;
      } else {
        const errorMsg = response.data.message || 'Failed to create subcategory';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while creating subcategory';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get all subcategories thunk
export const getAllSubCategories = createAsyncThunk(
  'subcategory/getAllSubCategories',
  async (params?: GetAllSubCategoriesParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.parentCategory) {
        queryParams.append('parentCategory', params.parentCategory);
      }
      
      const url = `/api/sub-category${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<SubCategoriesResponse>(url);
      
      if (response.data.success) {
        return response.data.data.subCategories;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch subcategories';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching subcategories';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get subcategory by ID thunk
export const getSubCategoryById = createAsyncThunk(
  'subcategory/getSubCategoryById',
  async (subCategoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<SubCategoryResponse>(`/api/sub-category/${subCategoryId}`);
      
      if (response.data.success) {
        return response.data.data.subCategory;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch subcategory';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching subcategory';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update subcategory thunk
export const updateSubCategory = createAsyncThunk(
  'subcategory/updateSubCategory',
  async ({ id, data }: { id: string; data: UpdateSubCategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await api.put<SubCategoryResponse>(`/api/sub-category/${id}`, data);
      
      if (response.data.success) {
        showToast.success('Subcategory updated successfully');
        return response.data.data.subCategory;
      } else {
        const errorMsg = response.data.message || 'Failed to update subcategory';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while updating subcategory';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete subcategory thunk
export const deleteSubCategory = createAsyncThunk(
  'subcategory/deleteSubCategory',
  async (subCategoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<DeleteSubCategoryResponse>(`/api/sub-category/${subCategoryId}`);
      
      if (response.data.success) {
        showToast.success('Subcategory deleted successfully');
        return subCategoryId;
      } else {
        const errorMsg = response.data.message || 'Failed to delete subcategory';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while deleting subcategory';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

