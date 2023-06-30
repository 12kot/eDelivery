import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotificationsType } from "types/types";

const initialState: NotificationsType = {
  type: null,
  header: "",
  description: "",
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification (state, action: PayloadAction<NotificationsType>) {
      state.type = action.payload.type;
      state.header = action.payload.header;
      state.description = action.payload.description;
    },
    hideNotifications(state) {
      state.type = null;
      state.header = "";
      state.description = "";
    }
  },
  extraReducers: (builder) => {
  },
});

export const { setNotification, hideNotifications } = notificationsSlice.actions;
export default notificationsSlice;

