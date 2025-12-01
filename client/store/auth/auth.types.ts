// User interface matching the server response
export interface User {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  }

  // API state interface for individual API calls
  export interface ApiState {
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
  }
  
  // Auth state interface
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    signInApiState: ApiState;
    signUpApiState: ApiState;
    forgotPasswordApiState: ApiState;
    verifyTokenApiState: ApiState;
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
  
  