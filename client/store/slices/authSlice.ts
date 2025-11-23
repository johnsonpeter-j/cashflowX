import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  SignInRequest,
  SignUpRequest,
  ForgotPasswordRequest,
  VerifyTokenRequest,
  ApiResponse,
  AuthResponse,
  User,
} from '@/types/api';
import { API_BASE_URL } from '@/types/api';
import { forgotPasswordThunk, signInThunk, signUpThunk, verifyTokenThunk } from './auth.thunk';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signInThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign in failed';
        state.isAuthenticated = false;
      });

    // Sign Up
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign up failed';
        state.isAuthenticated = false;
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send temporary password';
      });

    // Verify Token
    builder
      .addCase(verifyTokenThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyTokenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Token verification failed';
        state.isAuthenticated = false;
      });
  },
});

export const { setAuth, clearAuth, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;

