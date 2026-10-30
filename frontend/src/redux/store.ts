/** @format */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';

const AppStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof AppStore.getState>;
export type AppDispatch = typeof AppStore.dispatch;

export default AppStore;
