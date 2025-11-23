// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User Type
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
}

// Auth Response Type
export interface AuthResponse {
  user: User;
  token: string;
}

// Sign In Request
export interface SignInRequest {
  email: string;
  password: string;
}

// Sign Up Request
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Forgot Password Request
export interface ForgotPasswordRequest {
  email: string;
}

// Verify Token Request
export interface VerifyTokenRequest {
  token: string;
}

