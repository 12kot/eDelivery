import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        func(state, action: PayloadAction<string>) { }
    }
});

export const {func} = userSlice.actions;
export default userSlice;