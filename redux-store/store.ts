import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import notificationsReducer from "./reducers/notifications"


const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
