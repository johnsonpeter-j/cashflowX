import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse, ForgotPasswordRequest, SignInRequest, SignUpRequest, VerifyTokenRequest } from "./auth.types";
import api from "@/lib/api";
import { showToast } from "@/utils/toast";

// Async thunks
export const signIn = createAsyncThunk(
    'auth/signIn',
    async (credentials: SignInRequest, { rejectWithValue }) => {
      try {
        const response = await api.post<AuthResponse>('/api/auth/sign-in', credentials);
        
        if (response.data.success) {
          showToast.success('Sign in successful');
          return response.data.data;
        } else {
          const errorMsg = response.data.message || 'Sign in failed';
          showToast.error(errorMsg);
          return rejectWithValue(errorMsg);
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while signing in';
        showToast.error(errorMessage);
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
          showToast.success('Account created successfully');
          return response.data.data;
        } else {
          const errorMsg = response.data.message || 'Sign up failed';
          showToast.error(errorMsg);
          return rejectWithValue(errorMsg);
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while signing up';
        showToast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
      try {
        const response = await api.post('/api/auth/forgot-password', data);
        showToast.success('If the email exists, a password reset link has been sent');
        return response.data;
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'An error occurred while requesting password reset';
        showToast.error(errorMessage);
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
          showToast.success('Token verified successfully');
          return response.data.data;
        } else {
          const errorMsg = response.data.message || 'Token verification failed';
          showToast.error(errorMsg);
          return rejectWithValue(errorMsg);
        }
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Token verification failed';
        showToast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );