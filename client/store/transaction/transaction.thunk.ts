import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { showToast } from "@/utils/toast";
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  GetAllTransactionsParams,
  TransactionResponse,
  TransactionsResponse,
  DeleteTransactionResponse,
} from "./transaction.types";

// Create transaction thunk
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (transactionData: CreateTransactionRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<TransactionResponse>('/api/transaction', transactionData);
      
      if (response.data.success) {
        showToast.success('Transaction created successfully');
        return response.data.data.transaction;
      } else {
        const errorMsg = response.data.message || 'Failed to create transaction';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while creating transaction';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get all transactions thunk
export const getAllTransactions = createAsyncThunk(
  'transaction/getAllTransactions',
  async (params?: GetAllTransactionsParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      if (params?.category) {
        queryParams.append('category', params.category);
      }
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate);
      }
      
      const url = `/api/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<TransactionsResponse>(url);
      
      if (response.data.success) {
        return response.data.data.transactions;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch transactions';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching transactions';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get transaction by ID thunk
export const getTransactionById = createAsyncThunk(
  'transaction/getTransactionById',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<TransactionResponse>(`/api/transaction/${transactionId}`);
      
      if (response.data.success) {
        return response.data.data.transaction;
      } else {
        const errorMsg = response.data.message || 'Failed to fetch transaction';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching transaction';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update transaction thunk
export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, data }: { id: string; data: UpdateTransactionRequest }, { rejectWithValue }) => {
    try {
      const response = await api.put<TransactionResponse>(`/api/transaction/${id}`, data);
      
      if (response.data.success) {
        showToast.success('Transaction updated successfully');
        return response.data.data.transaction;
      } else {
        const errorMsg = response.data.message || 'Failed to update transaction';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while updating transaction';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete transaction thunk
export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<DeleteTransactionResponse>(`/api/transaction/${transactionId}`);
      
      if (response.data.success) {
        showToast.success('Transaction deleted successfully');
        return transactionId;
      } else {
        const errorMsg = response.data.message || 'Failed to delete transaction';
        showToast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while deleting transaction';
      showToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




