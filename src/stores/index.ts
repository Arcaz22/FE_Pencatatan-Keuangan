import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import categoryReducer from './slices/categorySlice';
import incomeReducer from './slices/incomeSlice';
import expenseReducer from './slices/expenseSlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    category: categoryReducer,
    income: incomeReducer,
    expense: expenseReducer,
    budget: budgetReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
