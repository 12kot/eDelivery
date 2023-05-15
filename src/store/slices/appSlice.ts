import {
  BannerType,
  ProductCategoriesType,
  ProductType,
} from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getItemsDB from "API/realtimeDB/getItemsDB";

type AppType = {
  categories: CategoryType[];
  banners: BannerType[];
  products: ProductCategoriesType;
  isLoading: boolean;
  currentProduct?: ProductType;
  currentCategory?: CategoryType;
};

const initialState: AppType = {
  categories: [],
  products: {
    products: [],
  },

  isLoading: false,
  banners: [],
};

export const fetchCollectionCategoriesData = createAsyncThunk<void>(
  "app/fetchCollectionCategoriesData",
  async function (_, { dispatch }) {
    dispatch(setIsLoading(true));
    const data: CategoryType[] = await getItemsDB(
      "categories",
      null,
      null,
      15
    );

    dispatch(setCategories(Object.values(data)));

    dispatch(setIsLoading(false));
  }
);

export const fetchCollectionProductsData = createAsyncThunk<void, { equalKey: string, equalValue: string | boolean | null }>(
  "app/fetchCollectionData", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));
  const data: ProductType[] = await getItemsDB(
    "products/products",
    props.equalKey,
    props.equalValue,
    15
  );

  dispatch(setProducts(Object.values(data)));

  dispatch(setIsLoading(false));
});

export const fetchProductData = createAsyncThunk<void, { id: string }>(
  "app/fetchProductData",
  async function (props, { dispatch }) {
    dispatch(setIsLoading(true));
    const data: ProductType[] = await getItemsDB(
      "products/products",
      "id",
      +props.id,
      1
    );

    if (data) dispatch(setCurrentProduct(data[0]));

    dispatch(setIsLoading(false));
  }
);

export const fetchCategoryData = createAsyncThunk<void, { category: string }>(
  "app/fetchProductData",
  async function (props, { dispatch }) {
    dispatch(setIsLoading(true));
    const data: CategoryType[] = await getItemsDB(
      "categories",
        "link",
      `category/${props.category}`,
      1
    );

    if (data) dispatch(setCurrentCategory(data[0]));

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
    setCurrentCategory(state, action: PayloadAction<CategoryType>) {
      state.currentCategory = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

const {
  setCategories,
  // setBanners,
  setProducts,
  setCurrentProduct,
  setIsLoading,
  setCurrentCategory,
} = appSlice.actions;
export default appSlice;
