import { BannerType } from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AppType = {
  categories: CategoryType[];
  banners: BannerType[];
};

const initialState: AppType = {
  categories: [],
  banners: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<CategoryType[]>) {
      state.categories = action.payload;
    },
    setBanners(state, action: PayloadAction<BannerType[]>) {
      state.banners = action.payload;
    },
  },
});

export const { setCategories, setBanners } = appSlice.actions;
export default appSlice;
