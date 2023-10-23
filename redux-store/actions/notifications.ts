import { AnyAction } from "@reduxjs/toolkit";

export const updateCartStatus = (cart: number): AnyAction => {
  return {
    type: "notifications/setCart",
    payload: cart,
  };
};

export const updateNotifStatus = (notif: number): AnyAction => {
  return {
    type: "notifications/setNotif",
    payload: notif,
  };
};