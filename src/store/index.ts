import { configureStore } from '@reduxjs/toolkit';
import meritDataReducer from './slices/meritDataSlice';

export const store = configureStore({
  reducer: {
    meritData: meritDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
