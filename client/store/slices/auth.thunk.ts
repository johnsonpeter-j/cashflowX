import { API_BASE_URL, ApiResponse, AuthResponse, ForgotPasswordRequest, SignInRequest, SignUpRequest, VerifyTokenRequest } from "@/types/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signInThunk = createAsyncThunk<
  AuthResponse,
  SignInRequest,
  { rejectValue: string }
>('auth/signIn', async (data, { rejectWithValue }) => {
  try {
    console.log('signInThunk called with:', { email: data.email, password: '***' });
    console.log('API_BASE_URL:', API_BASE_URL);
    const url = `${API_BASE_URL}/api/auth/sign-in`;
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response data:', result);

    if (!response.ok) {
      console.log('Response not OK, rejecting with:', result.message || 'Sign in failed');
      return rejectWithValue(result.message || 'Sign in failed');
    }

    if (!result.data) {
      console.log('No data in response, rejecting');
      return rejectWithValue('Invalid response from server');
    }

    console.log('Sign in successful, returning data');
    return result.data;
  } catch (error) {
    console.error('Sign in error:', error);
    return rejectWithValue(
      'An error occurred while signing in. Please check your connection and try again.'
    );
  }
});

export const signUpThunk = createAsyncThunk<
  AuthResponse,
  SignUpRequest,
  { rejectValue: string }
>('auth/signUp', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Sign up failed');
    }

    if (!result.data) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Sign up error:', error);
    return rejectWithValue(
      'An error occurred while signing up. Please check your connection and try again.'
    );
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  ApiResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to send temporary password');
    }

    return {
      success: true,
      message: result.message || 'A temporary password has been sent to your email address',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return rejectWithValue(
      'An error occurred. Please check your connection and try again.'
    );
  }
});

export const verifyTokenThunk = createAsyncThunk<
  AuthResponse,
  VerifyTokenRequest,
  { rejectValue: string }
>('auth/verifyToken', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Token verification failed');
    }

    if (!result.data) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Verify token error:', error);
    return rejectWithValue(
      'An error occurred while verifying token. Please check your connection and try again.'
    );
  }
});