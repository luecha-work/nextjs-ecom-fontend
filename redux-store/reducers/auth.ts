import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isLoggedIn: boolean;
  userRole: number;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userRole: 3,
  } as AuthState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUserRole: (state, action: PayloadAction<number>) => {
      state.userRole = action.payload;
    },
  },
});

export const { setLoggedIn, setUserRole } = authSlice.actions;
export default authSlice.reducer;
