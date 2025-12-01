// Transaction interface matching the server response
export interface Transaction {
  _id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
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
  transactionOn: string;
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

// Transaction state interface
export interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  createTransactionApiState: ApiState;
  getAllTransactionsApiState: ApiState;
  getTransactionByIdApiState: ApiState;
  updateTransactionApiState: ApiState;
  deleteTransactionApiState: ApiState;
}

// Create transaction request payload
export interface CreateTransactionRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  subCategories?: string[];
  amount: number;
  transactionOn: string; // ISO date string
}

// Update transaction request payload
export interface UpdateTransactionRequest {
  name?: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  subCategories?: string[];
  amount?: number;
  transactionOn?: string; // ISO date string
}

// Get all transactions query params
export interface GetAllTransactionsParams {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

// Transaction response from API (single transaction)
export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction: Transaction;
  };
}

// Transactions list response from API
export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    count: number;
  };
}

// Delete transaction response
export interface DeleteTransactionResponse {
  success: boolean;
  message: string;
}


