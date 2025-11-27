import { configureStore } from '@reduxjs/toolkit';
import authReducer from './user/user.slice';
import categoryReducer from './category/category.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

