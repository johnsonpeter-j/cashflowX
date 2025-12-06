import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse, ForgotPasswordRequest, SignInRequest, SignUpRequest, VerifyTokenRequest } from "./auth.types";
import api from "@/lib/api";

// Async thunks
export const signIn = createAsyncThunk(
    'auth/signIn',
    async (credentials: SignInRequest, { rejectWithValue }) => {
      try {
        const response = await api.post<AuthResponse>('/api/auth/sign-in', credentials);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          return rejectWithValue(response.data.message || 'Sign in failed');
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while signing in';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const signUp = createAsyncThunk(
    'auth/signUp',
    async (userData: SignUpRequest, { rejectWithValue }) => {
      try {
        const response = await api.post<AuthResponse>('/api/auth/sign-up', userData);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          return rejectWithValue(response.data.message || 'Sign up failed');
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while signing up';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
      try {
        const response = await api.post('/api/auth/forgot-password', data);
        return response.data;
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while requesting password reset';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async (data: VerifyTokenRequest, { rejectWithValue }) => {
      try {
        const response = await api.post<AuthResponse>('/api/auth/verify-token', data);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          return rejectWithValue(response.data.message || 'Token verification failed');
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Token verification failed';
        return rejectWithValue(errorMessage);
      }
    }
  );