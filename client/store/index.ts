import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import categoryReducer from './category/category.slice';
import subCategoryReducer from './subcategory/subcategory.slice';
import transactionReducer from './transaction/transaction.slice';
import budgetReducer from './budget/budget.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    subcategory: subCategoryReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




