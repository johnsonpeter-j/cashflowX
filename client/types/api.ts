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

// Update Profile Request
export interface UpdateProfileRequest {
  name?: string;
  profileImage?: File | Blob | null;
}

// Change Password Request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Category Types
export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  _id: string;
  name: string;
  description: string;
  type: CategoryType;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Create Category Request
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  type: CategoryType;
}

// Update Category Request
export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  type?: CategoryType;
}

// Category Response
export interface CategoryResponse {
  category: Category;
}

// Categories Response
export interface CategoriesResponse {
  categories: Category[];
  count: number;
}

