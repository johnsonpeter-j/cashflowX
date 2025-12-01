import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "./transaction.thunk";
import { TransactionState, Transaction } from "./transaction.types";

// Initial state
const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  createTransactionApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getAllTransactionsApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getTransactionByIdApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  updateTransactionApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  deleteTransactionApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
};

// Transaction slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearCreateTransactionError: (state) => {
      state.createTransactionApiState.error = null;
    },
    clearGetAllTransactionsError: (state) => {
      state.getAllTransactionsApiState.error = null;
    },
    clearGetTransactionByIdError: (state) => {
      state.getTransactionByIdApiState.error = null;
    },
    clearUpdateTransactionError: (state) => {
      state.updateTransactionApiState.error = null;
    },
    clearDeleteTransactionError: (state) => {
      state.deleteTransactionApiState.error = null;
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    // Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.createTransactionApiState.isLoading = true;
        state.createTransactionApiState.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.createTransactionApiState.isLoading = false;
        state.createTransactionApiState.lastFetched = Date.now();
        state.transactions.unshift(action.payload); // Add to beginning of array
        state.createTransactionApiState.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.createTransactionApiState.isLoading = false;
        state.createTransactionApiState.error = action.payload as string;
      });

    // Get All Transactions
    builder
      .addCase(getAllTransactions.pending, (state) => {
        state.getAllTransactionsApiState.isLoading = true;
        state.getAllTransactionsApiState.error = null;
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.getAllTransactionsApiState.isLoading = false;
        state.getAllTransactionsApiState.lastFetched = Date.now();
        state.transactions = action.payload;
        state.getAllTransactionsApiState.error = null;
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.getAllTransactionsApiState.isLoading = false;
        state.getAllTransactionsApiState.error = action.payload as string;
      });

    // Get Transaction By ID
    builder
      .addCase(getTransactionById.pending, (state) => {
        state.getTransactionByIdApiState.isLoading = true;
        state.getTransactionByIdApiState.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.getTransactionByIdApiState.isLoading = false;
        state.getTransactionByIdApiState.lastFetched = Date.now();
        state.selectedTransaction = action.payload;
        state.getTransactionByIdApiState.error = null;
        // Update transaction in list if it exists
        const index = state.transactions.findIndex(trans => trans._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.getTransactionByIdApiState.isLoading = false;
        state.getTransactionByIdApiState.error = action.payload as string;
      });

    // Update Transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.updateTransactionApiState.isLoading = true;
        state.updateTransactionApiState.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updateTransactionApiState.isLoading = false;
        state.updateTransactionApiState.lastFetched = Date.now();
        const index = state.transactions.findIndex(trans => trans._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        // Update selected transaction if it's the one being updated
        if (state.selectedTransaction && state.selectedTransaction._id === action.payload._id) {
          state.selectedTransaction = action.payload;
        }
        state.updateTransactionApiState.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updateTransactionApiState.isLoading = false;
        state.updateTransactionApiState.error = action.payload as string;
      });

    // Delete Transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.deleteTransactionApiState.isLoading = true;
        state.deleteTransactionApiState.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteTransactionApiState.isLoading = false;
        state.deleteTransactionApiState.lastFetched = Date.now();
        state.transactions = state.transactions.filter(trans => trans._id !== action.payload);
        // Clear selected transaction if it was deleted
        if (state.selectedTransaction && state.selectedTransaction._id === action.payload) {
          state.selectedTransaction = null;
        }
        state.deleteTransactionApiState.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteTransactionApiState.isLoading = false;
        state.deleteTransactionApiState.error = action.payload as string;
      });
  },
});

export const { 
  clearCreateTransactionError,
  clearGetAllTransactionsError,
  clearGetTransactionByIdError,
  clearUpdateTransactionError,
  clearDeleteTransactionError,
  setSelectedTransaction, 
  clearSelectedTransaction 
} = transactionSlice.actions;
export default transactionSlice.reducer;


