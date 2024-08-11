import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../build/store';

interface LoggedInUserType {
  id: string;
  name: string;
  email: string;
}

export interface LoggedInUserState {
  value: LoggedInUserType;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LoggedInUserState = {
  value: {
    id: localStorage.getItem("id") || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || ""
  },
  status: 'idle',
};

export const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<LoggedInUserType>) => {
      state.value = action.payload;
    },
  },
});

export const { setLoggedInUser } = loggedInUserSlice.actions;
export const selectLoggedInUser = (state: RootState) => state.loggedInUser.value;
export default loggedInUserSlice.reducer;