import {
  BannerType,
  ProductCategoriesType,
  ProductType,
} from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getItemsDB from "API/realtimeDB/getItemsDB";
import getNumberItems from "API/realtimeDB/getNumberOfItems";
import getSearchItems from "API/realtimeDB/getSearchItems";
import getSearchNumberOfItems from "API/realtimeDB/getSearchNumberOfItems";

type AppType = {
  categories: CategoryType[];
  banners: BannerType[];
  products: ProductCategoriesType;
  isLoading: boolean;
  currentProduct?: ProductType;
  currentCategory?: CategoryType;

  totalNumberOfItems: number;
};

const initialState: AppType = {
  categories: [],
  products: {
    products: [],
    search: {
      products: [],
      totalNumberOfItems: 0,
    },
  },

  totalNumberOfItems: 0,
  isLoading: false,
  banners: [],
};

export const fetchCollectionCategoriesData = createAsyncThunk<void>(
  "app/fetchCollectionCategoriesData",
  async function (_, { dispatch }) {
    dispatch(setIsLoading(true));
    const data: CategoryType[] = await getItemsDB("categories", null, null, 15);

    dispatch(setCategories(Object.values(data)));

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

export const fetchCollectionProductsData = createAsyncThunk<
  void,
  { equalKey: string; equalValue: string | boolean | null; count: number }
>("app/fetchCollectionData", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));
  const data: ProductType[] = await getItemsDB(
    "products/products",
    props.equalKey,
    props.equalValue,
    props.count
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

export const fetchNumberOfItems = createAsyncThunk<
  void,
  { equalKey: string; equalValue: string | boolean }
>("app/fetchNumberOfItems", async function (props, { dispatch }) {
  const count: number = await getNumberItems(
    "products/products",
    props.equalKey,
    props.equalValue
  );

  dispatch(setNumberOfProducts(count));
});

export const fetchSearchItems = createAsyncThunk<
  void,
  { equalKey: string; equalValue: string, count: number }
>("app/fetchNumberOfItems", async function (props, { dispatch }) {
  const products: ProductType[] = await getSearchItems("products/products", props.equalKey, props.equalValue, props.count);

  dispatch(setSearchProducts(Object.values(products)));
});

export const fetchNumberOfSearchItems = createAsyncThunk<
  void,
  { equalKey: string; equalValue: string }
>("app/fetchNumberOfSearchItems", async function (props, { dispatch }) {
  let count: number = await getSearchNumberOfItems("products/products", props.equalKey, props.equalValue);

  dispatch(setSearchNumberOfProducts(count));
});

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
    setNumberOfProducts(state, action: PayloadAction<number>) {
      state.totalNumberOfItems = action.payload;
    },
    setCurrentCategory(state, action: PayloadAction<CategoryType>) {
      state.currentCategory = action.payload;
    },
    setSearchProducts(state, action: PayloadAction<ProductType[]>) {
      state.products.search.products = action.payload;
    },
    setSearchNumberOfProducts(state, action: PayloadAction<number>) {
      state.products.search.totalNumberOfItems = action.payload;
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
  setNumberOfProducts,
  setSearchProducts,
  setSearchNumberOfProducts,
} = appSlice.actions;
export default appSlice;
