import {
  BannerType,
  ProductCategoriesType,
  ProductType,
} from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getDataDB from "API/realtimeDB/getDataDB";

type AppType = {
  categories: CategoryType[];
  banners: BannerType[];
  products: ProductCategoriesType;
  isLoading: boolean;
  currentProduct?: ProductType;
};

const initialState: AppType = {
  categories: [],
  products: {
    products: [],
  },

  isLoading: false,
  banners: [],
};

export const fetchData = createAsyncThunk<void, { path: string; type: string }>(
  "app/fetchData",
  async function (props, { dispatch }) {
    dispatch(setIsLoading(true));
    const data: any = await getDataDB(props.path);

    if (data)
      switch (props.type) {
        case "SET_CATEGORIES":
          dispatch(setCategories(data));
          break;
        case "SET_ALL_PRODUCTS":
          dispatch(setProducts(Object.values(data)));
          break;
        case "SET_PRODUCT":
          dispatch(setCurrentProduct(data));
          break;
      }

    dispatch(setIsLoading(false));
  }
);

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
    setProducts(state, action: PayloadAction<ProductType[]>) {
      state.products.products = action.payload;
    },
    setCurrentProduct(state, action: PayloadAction<ProductType>) {
      state.currentProduct = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

const {
  setCategories,
  setBanners,
  setProducts,
  setCurrentProduct,
  setIsLoading,
} = appSlice.actions;
export default appSlice;
