import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "./budget.thunk";
import { BudgetState, Budget } from "./budget.types";

// Initial state
const initialState: BudgetState = {
  budgets: [],
  selectedBudget: null,
  createBudgetApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getAllBudgetsApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  getBudgetByIdApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  updateBudgetApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  deleteBudgetApiState: {
    isLoading: false,
    error: null,
    lastFetched: null,
  },
};

// Budget slice
const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearCreateBudgetError: (state) => {
      state.createBudgetApiState.error = null;
    },
    clearGetAllBudgetsError: (state) => {
      state.getAllBudgetsApiState.error = null;
    },
    clearGetBudgetByIdError: (state) => {
      state.getBudgetByIdApiState.error = null;
    },
    clearUpdateBudgetError: (state) => {
      state.updateBudgetApiState.error = null;
    },
    clearDeleteBudgetError: (state) => {
      state.deleteBudgetApiState.error = null;
    },
    setSelectedBudget: (state, action: PayloadAction<Budget | null>) => {
      state.selectedBudget = action.payload;
    },
    clearSelectedBudget: (state) => {
      state.selectedBudget = null;
    },
  },
  extraReducers: (builder) => {
    // Create Budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.createBudgetApiState.isLoading = true;
        state.createBudgetApiState.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.createBudgetApiState.isLoading = false;
        state.createBudgetApiState.lastFetched = Date.now();
        state.budgets.unshift(action.payload); // Add to beginning of array
        state.createBudgetApiState.error = null;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.createBudgetApiState.isLoading = false;
        state.createBudgetApiState.error = action.payload as string;
      });

    // Get All Budgets
    builder
      .addCase(getAllBudgets.pending, (state) => {
        state.getAllBudgetsApiState.isLoading = true;
        state.getAllBudgetsApiState.error = null;
      })
      .addCase(getAllBudgets.fulfilled, (state, action) => {
        state.getAllBudgetsApiState.isLoading = false;
        state.getAllBudgetsApiState.lastFetched = Date.now();
        state.budgets = action.payload;
        state.getAllBudgetsApiState.error = null;
      })
      .addCase(getAllBudgets.rejected, (state, action) => {
        state.getAllBudgetsApiState.isLoading = false;
        state.getAllBudgetsApiState.error = action.payload as string;
      });

    // Get Budget By ID
    builder
      .addCase(getBudgetById.pending, (state) => {
        state.getBudgetByIdApiState.isLoading = true;
        state.getBudgetByIdApiState.error = null;
      })
      .addCase(getBudgetById.fulfilled, (state, action) => {
        state.getBudgetByIdApiState.isLoading = false;
        state.getBudgetByIdApiState.lastFetched = Date.now();
        state.selectedBudget = action.payload;
        state.getBudgetByIdApiState.error = null;
        // Update budget in list if it exists
        const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(getBudgetById.rejected, (state, action) => {
        state.getBudgetByIdApiState.isLoading = false;
        state.getBudgetByIdApiState.error = action.payload as string;
      });

    // Update Budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.updateBudgetApiState.isLoading = true;
        state.updateBudgetApiState.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.updateBudgetApiState.isLoading = false;
        state.updateBudgetApiState.lastFetched = Date.now();
        const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        // Update selected budget if it's the one being updated
        if (state.selectedBudget && state.selectedBudget._id === action.payload._id) {
          state.selectedBudget = action.payload;
        }
        state.updateBudgetApiState.error = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.updateBudgetApiState.isLoading = false;
        state.updateBudgetApiState.error = action.payload as string;
      });

    // Delete Budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.deleteBudgetApiState.isLoading = true;
        state.deleteBudgetApiState.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.deleteBudgetApiState.isLoading = false;
        state.deleteBudgetApiState.lastFetched = Date.now();
        state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
        // Clear selected budget if it was deleted
        if (state.selectedBudget && state.selectedBudget._id === action.payload) {
          state.selectedBudget = null;
        }
        state.deleteBudgetApiState.error = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.deleteBudgetApiState.isLoading = false;
        state.deleteBudgetApiState.error = action.payload as string;
      });
  },
});

export const { 
  clearCreateBudgetError,
  clearGetAllBudgetsError,
  clearGetBudgetByIdError,
  clearUpdateBudgetError,
  clearDeleteBudgetError,
  setSelectedBudget, 
  clearSelectedBudget 
} = budgetSlice.actions;
export default budgetSlice.reducer;


