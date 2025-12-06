// User interface matching the server response
export interface User {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  }
  
  // Auth state interface
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // Sign in request payload
  export interface SignInRequest {
    email: string;
    password: string;
  }
  
  // Sign up request payload
  export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  // Auth response from API
  export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      token: string;
    };
  }
  
  // Forgot password request payload
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  // Verify token request payload
  export interface VerifyTokenRequest {
    token: string;
  }
  
  