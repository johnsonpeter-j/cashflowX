import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgotPassword, signIn, signUp, verifyToken } from "./auth.thunk";
import { AuthState } from "./auth.types";
import { storage } from "@/utils/storage";

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    signInApiState: {
      isLoading: false,
      error: null,
      lastFetched: null,
    },
    signUpApiState: {
      isLoading: false,
      error: null,
      lastFetched: null,
    },
    forgotPasswordApiState: {
      isLoading: false,
      error: null,
      lastFetched: null,
    },
    verifyTokenApiState: {
      isLoading: false,
      error: null,
      lastFetched: null,
    },
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
        // Clear all API errors
        state.signInApiState.error = null;
        state.signUpApiState.error = null;
        state.forgotPasswordApiState.error = null;
        state.verifyTokenApiState.error = null;
        // Clear token from storage
        storage.clearAuth().catch((error) => {
          console.error('Error clearing auth storage:', error);
        });
      },
      clearSignInError: (state) => {
        state.signInApiState.error = null;
      },
      clearSignUpError: (state) => {
        state.signUpApiState.error = null;
      },
      clearForgotPasswordError: (state) => {
        state.forgotPasswordApiState.error = null;
      },
      clearVerifyTokenError: (state) => {
        state.verifyTokenApiState.error = null;
      },
      setCredentials: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      },
    },
    extraReducers: (builder) => {
      // Sign In
      builder
        .addCase(signIn.pending, (state) => {
          state.signInApiState.isLoading = true;
          state.signInApiState.error = null;
        })
        .addCase(signIn.fulfilled, (state, action) => {
          state.signInApiState.isLoading = false;
          state.signInApiState.lastFetched = Date.now();
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.signInApiState.error = null;
          // Save token and user to storage
          storage.saveToken(action.payload.token).catch((error) => {
            console.error('Error saving token:', error);
          });
          storage.saveUser(action.payload.user).catch((error) => {
            console.error('Error saving user:', error);
          });
        })
        .addCase(signIn.rejected, (state, action) => {
          state.signInApiState.isLoading = false;
          state.signInApiState.error = action.payload as string;
          state.isAuthenticated = false;
        });
  
      // Sign Up
      builder
        .addCase(signUp.pending, (state) => {
          state.signUpApiState.isLoading = true;
          state.signUpApiState.error = null;
        })
        .addCase(signUp.fulfilled, (state, action) => {
          state.signUpApiState.isLoading = false;
          state.signUpApiState.lastFetched = Date.now();
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.signUpApiState.error = null;
          // Save token and user to storage
          storage.saveToken(action.payload.token).catch((error) => {
            console.error('Error saving token:', error);
          });
          storage.saveUser(action.payload.user).catch((error) => {
            console.error('Error saving user:', error);
          });
        })
        .addCase(signUp.rejected, (state, action) => {
          state.signUpApiState.isLoading = false;
          state.signUpApiState.error = action.payload as string;
          state.isAuthenticated = false;
        });
  
      // Forgot Password
      builder
        .addCase(forgotPassword.pending, (state) => {
          state.forgotPasswordApiState.isLoading = true;
          state.forgotPasswordApiState.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state) => {
          state.forgotPasswordApiState.isLoading = false;
          state.forgotPasswordApiState.lastFetched = Date.now();
          state.forgotPasswordApiState.error = null;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
          state.forgotPasswordApiState.isLoading = false;
          state.forgotPasswordApiState.error = action.payload as string;
        });
  
      // Verify Token
      builder
        .addCase(verifyToken.pending, (state) => {
          state.verifyTokenApiState.isLoading = true;
          state.verifyTokenApiState.error = null;
        })
        .addCase(verifyToken.fulfilled, (state, action) => {
          state.verifyTokenApiState.isLoading = false;
          state.verifyTokenApiState.lastFetched = Date.now();
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.verifyTokenApiState.error = null;
          // Save token and user to storage
          storage.saveToken(action.payload.token).catch((error) => {
            console.error('Error saving token:', error);
          });
          storage.saveUser(action.payload.user).catch((error) => {
            console.error('Error saving user:', error);
          });
        })
        .addCase(verifyToken.rejected, (state, action) => {
          state.verifyTokenApiState.isLoading = false;
          state.verifyTokenApiState.error = action.payload as string;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        });
    },
  });
  
  export const { 
    logout, 
    clearSignInError, 
    clearSignUpError, 
    clearForgotPasswordError, 
    clearVerifyTokenError, 
    setCredentials 
  } = authSlice.actions;
  export default authSlice.reducer;