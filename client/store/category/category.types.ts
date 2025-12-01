// Category interface matching the server response
export interface Category {
  _id: string;
  name: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API state interface for individual API calls
export interface ApiState {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Category state interface
export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  createCategoryApiState: ApiState;
  getAllCategoriesApiState: ApiState;
  getCategoryByIdApiState: ApiState;
  updateCategoryApiState: ApiState;
  deleteCategoryApiState: ApiState;
}

// Create category request payload
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
}

// Update category request payload
export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  type?: 'INCOME' | 'EXPENSE';
}

// Category response from API (single category)
export interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: Category;
  };
}

// Categories list response from API
export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
    count: number;
  };
}

// Delete category response
export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}


