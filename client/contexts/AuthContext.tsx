import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '@/types/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuth, clearAuth, updateUser as updateUserAction } from '@/store/slices/authSlice';
import { verifyTokenThunk } from '@/store/slices/auth.thunk';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (authData: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = '@cashflowx_token';
const USER_STORAGE_KEY = '@cashflowx_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Sync Redux state changes to AsyncStorage
  // This ensures token is stored whenever Redux state changes (from thunks or actions)
  useEffect(() => {
    if (user && token) {
      // Auth state changed, persist to AsyncStorage
      // This handles: sign-in, sign-up, and verify-token flows
      Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]).catch((error) => {
        console.error('Error saving auth data to storage:', error);
      });
    } else if (!user && !token) {
      // Auth cleared, remove from AsyncStorage
      clearStoredAuth();
    }
  }, [user, token]);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      if (storedToken && storedUser) {
        // Verify token is still valid using Redux thunk
        // The thunk will update Redux state, and useEffect will persist to AsyncStorage
        try {
          const result = await dispatch(verifyTokenThunk({ token: storedToken })).unwrap();
          if (result) {
            // Token is valid - thunk already updated Redux state
            // useEffect will automatically persist the new token to AsyncStorage
            // No need to call setAuth again as thunk already updated Redux
          } else {
            // Token is invalid, clear storage
            await clearStoredAuth();
            dispatch(clearAuth());
          }
        } catch (error) {
          // Token verification failed, clear storage
          await clearStoredAuth();
          dispatch(clearAuth());
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearStoredAuth();
      dispatch(clearAuth());
    }
  };

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
        AsyncStorage.removeItem(USER_STORAGE_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  };

  const signIn = async (authData: AuthResponse) => {
    // Update Redux state - useEffect will automatically persist to AsyncStorage
    // This method is used by components after successful sign-in/sign-up thunks
    dispatch(setAuth(authData));
    // Note: We also save immediately to ensure it's stored even if component unmounts
    // The useEffect will handle persistence, but this ensures immediate storage
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, authData.token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user)),
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
      // Don't throw - Redux state is updated, useEffect will retry
    }
  };

  const signOut = async () => {
    await clearStoredAuth();
    dispatch(clearAuth());
  };

  const updateUser = (updatedUser: User) => {
    // Update Redux state
    dispatch(updateUserAction(updatedUser));
    // Update AsyncStorage
    AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser)).catch((error) => {
      console.error('Error updating user:', error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
