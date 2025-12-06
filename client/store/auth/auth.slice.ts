import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgotPassword, signIn, signUp, verifyToken } from "./auth.thunk";
import { AuthState } from "./auth.types";

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    signInApiState:{
        isLoading: false,
        error: null,
        lastRequestTime: null,
    }
  };
  
  
  
  // Auth slice
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        // TODO: Clear token from storage (AsyncStorage/SecureStore)
      },
      clearError: (state) => {
        state.error = null;
      },
      setCredentials: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      // Sign In
      builder
        .addCase(signIn.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(signIn.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
          // TODO: Save token to storage (AsyncStorage/SecureStore)
        })
        .addCase(signIn.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.isAuthenticated = false;
        });
  
      // Sign Up
      builder
        .addCase(signUp.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(signUp.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
          // TODO: Save token to storage (AsyncStorage/SecureStore)
        })
        .addCase(signUp.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.isAuthenticated = false;
        });
  
      // Forgot Password
      builder
        .addCase(forgotPassword.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state) => {
          state.isLoading = false;
          state.error = null;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        });
  
      // Verify Token
      builder
        .addCase(verifyToken.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(verifyToken.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        })
        .addCase(verifyToken.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        });
    },
  });
  
  export const { logout, clearError, setCredentials } = authSlice.actions;
  export default authSlice.reducer;