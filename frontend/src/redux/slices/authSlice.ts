/** @format */

import type { IUser } from '../../types/auth.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Dead state for now
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Dead state for now
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    // Dead state for now
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
