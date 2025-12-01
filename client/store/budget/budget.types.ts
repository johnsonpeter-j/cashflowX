// Budget interface matching the server response
export interface Budget {
  _id: string;
  category: {
    _id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
  };
  subCategories: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  amount: number;
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

// Budget state interface
export interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  createBudgetApiState: ApiState;
  getAllBudgetsApiState: ApiState;
  getBudgetByIdApiState: ApiState;
  updateBudgetApiState: ApiState;
  deleteBudgetApiState: ApiState;
}

// Create budget request payload
export interface CreateBudgetRequest {
  category: string;
  subCategories?: string[];
  amount: number;
}

// Update budget request payload
export interface UpdateBudgetRequest {
  category?: string;
  subCategories?: string[];
  amount?: number;
}

// Get all budgets query params
export interface GetAllBudgetsParams {
  category?: string;
}

// Budget response from API (single budget)
export interface BudgetResponse {
  success: boolean;
  message: string;
  data: {
    budget: Budget;
  };
}

// Budgets list response from API
export interface BudgetsResponse {
  success: boolean;
  message: string;
  data: {
    budgets: Budget[];
    count: number;
  };
}

// Delete budget response
export interface DeleteBudgetResponse {
  success: boolean;
  message: string;
}


