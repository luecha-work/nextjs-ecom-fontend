import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface NotificationsState {
  cart: number;
  notif: number;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    cart: 0,
    notif: 0,
  } as NotificationsState,
  
  reducers: {
    setCart: (state, action: PayloadAction<number>) => {
      state.cart = action.payload;
    },
    setNotif: (state, action: PayloadAction<number>) => {
      state.notif = action.payload;
    },
  },
});

export const { setCart, setNotif } = notificationsSlice.actions;
export default notificationsSlice.reducer;
