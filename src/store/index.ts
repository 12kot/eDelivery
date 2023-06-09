import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import appSlice from "./slices/appSlice";
import notificationsSlice from "./slices/notificationsSlice";

const rootReducer = combineReducers({
  app: appSlice.reducer,
  user: userSlice.reducer,
  notifications: notificationsSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
