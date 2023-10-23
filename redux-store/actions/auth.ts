import { AnyAction } from "@reduxjs/toolkit";

export const updateLoggedInStatus = (isLoggedIn: boolean): AnyAction => {
  return {
    type: "auth/setLoggedIn",
    payload: isLoggedIn,
  };
};

export const updateUserRoleStatus = (role: number): AnyAction => {
  return {
    type: "auth/setUserRole",
    payload: role,
  };
};
