import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../build/store';

export interface TokenState {
  value: string;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TokenState = {
  value: localStorage.getItem("token") || "",
  status: 'idle',
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;
export const selectToken = (state: RootState) => state.token.value;
export default tokenSlice.reducer;
