import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { showToast } from "@/utils/toast";
import {
  CreateBudgetRequest,
  UpdateBudgetRequest,
  GetAllBudgetsParams,
  BudgetResponse,
  BudgetsResponse,
  DeleteBudgetResponse,
} from "./budget.types";

// Create budget thunk
export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData: CreateBudgetRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BudgetResponse>('/api/budget', budgetData);
      
      if (response.data.success) {
        showToast.success('Budget created successfully');
        return response.data.data.budget;
      } else {
        const errorMsg = response.data.message || 'Failed to create budget';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while creating budget';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get all budgets thunk
export const getAllBudgets = createAsyncThunk(
  'budget/getAllBudgets',
  async (params?: GetAllBudgetsParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) {
        queryParams.append('category', params.category);
      }
      
      const url = `/api/budget${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<BudgetsResponse>(url);
      
      if (response.data.success) {
        return response.data.data.budgets;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch budgets';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching budgets';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get budget by ID thunk
export const getBudgetById = createAsyncThunk(
  'budget/getBudgetById',
  async (budgetId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<BudgetResponse>(`/api/budget/${budgetId}`);
      
      if (response.data.success) {
        return response.data.data.budget;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch budget';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching budget';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update budget thunk
export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, data }: { id: string; data: UpdateBudgetRequest }, { rejectWithValue }) => {
    try {
      const response = await api.put<BudgetResponse>(`/api/budget/${id}`, data);
      
      if (response.data.success) {
        showToast.success('Budget updated successfully');
        return response.data.data.budget;
      } else {
        const errorMsg = response.data.message || 'Failed to update budget';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while updating budget';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete budget thunk
export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (budgetId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<DeleteBudgetResponse>(`/api/budget/${budgetId}`);
      
      if (response.data.success) {
        showToast.success('Budget deleted successfully');
        return budgetId;
      } else {
        const errorMsg = response.data.message || 'Failed to delete budget';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while deleting budget';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




