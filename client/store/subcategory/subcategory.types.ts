// SubCategory interface matching the server response
export interface SubCategory {
  _id: string;
  name: string;
  description: string;
  parentCategory: {
    _id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
  };
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

// SubCategory state interface
export interface SubCategoryState {
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory | null;
  createSubCategoryApiState: ApiState;
  getAllSubCategoriesApiState: ApiState;
  getSubCategoryByIdApiState: ApiState;
  updateSubCategoryApiState: ApiState;
  deleteSubCategoryApiState: ApiState;
}

// Create subcategory request payload
export interface CreateSubCategoryRequest {
  name: string;
  description?: string;
  parentCategory: string;
}

// Update subcategory request payload
export interface UpdateSubCategoryRequest {
  name?: string;
  description?: string;
  parentCategory?: string;
}

// Get all subcategories query params
export interface GetAllSubCategoriesParams {
  parentCategory?: string;
}

// SubCategory response from API (single subcategory)
export interface SubCategoryResponse {
  success: boolean;
  message: string;
  data: {
    subCategory: SubCategory;
  };
}

// SubCategories list response from API
export interface SubCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    subCategories: SubCategory[];
    count: number;
  };
}

// Delete subcategory response
export interface DeleteSubCategoryResponse {
  success: boolean;
  message: string;
}


