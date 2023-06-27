import {
  BannerType,
  ProductCategoriesType,
  ProductType,
} from "./../../types/types";
import { CategoryType } from "types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

export const fetchCollectionCategoriesData = createAsyncThunk<CategoryType[]>(
  "app/fetchCollectionCategoriesData",
  async () => {
    const data: CategoryType[] = await getItemsDB("categories", null, null, 15);
    return Object.values(data);
  }
);

export const fetchCategoryData = createAsyncThunk<
  CategoryType,
  { category: string }
>("app/fetchCategoryData", async (props) => {
  const data: CategoryType[] = await getItemsDB(
    "categories",
    "link",
    `category/${props.category}`,
    1
  );

  return data[0];
});

export const fetchCollectionProductsData = createAsyncThunk<
  ProductType[],
  { equalKey: string; equalValue: string | boolean | null; count: number }
>("app/fetchCollectionData", async (props) => {
  let data: ProductType[] = [];

  if (props.equalValue && props.equalKey !== "isDiscount") {
    const items: number[] = await getItemsDB(
      `products/${props.equalValue}`,
      props.equalKey,
      null,
      props.count
    );

    for (const id of items) {
      const item: ProductType[] = await getItemsDB(
        "products/products",
        "id",
        id,
        1
      );
      
      if(item[0].id) data.push(item[0]);
    }
    
    return Object.values(data);
  }

  data = await getItemsDB(
    "products/products",
    props.equalKey,
    props.equalValue,
    props.count
    );
    
  return Object.values(data);
});

export const fetchProductData = createAsyncThunk<ProductType, { id: string }>(
  "app/fetchProductData",
  async (props) => {
    const data: ProductType[] = await getItemsDB(
      "products/products",
      "id",
      +props.id,
      1
    );

    return data[0];
  }
);

export const fetchNumberOfItems = createAsyncThunk<
  number,
  { equalKey: string; equalValue: string | boolean }
>("app/fetchNumberOfItems", async (props) => {
  const count: number = await getNumberItems(
    "products/products",
    props.equalKey,
    props.equalValue
  );

  return count;
});

export const fetchSearchItems = createAsyncThunk<
  ProductType[],
  { equalKey: string; equalValue: string; count: number }
>("app/fetchSearchItems", async (props) => {
  const products: ProductType[] = await getSearchItems(
    "products/products",
    props.equalKey,
    props.equalValue.toLowerCase(),
    props.count
  );

  return Object.values(products);
});

export const fetchNumberOfSearchItems = createAsyncThunk<
  number,
  { equalKey: string; equalValue: string }
>("app/fetchNumberOfSearchItems", async (props) => {
  let count: number = await getSearchNumberOfItems(
    "products/products",
    props.equalKey,
    props.equalValue.toLowerCase()
  );

  return count;
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionCategoriesData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCollectionCategoriesData.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchCategoryData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCategoryData.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchCollectionProductsData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCollectionProductsData.fulfilled, (state, action) => {
        state.products.products = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchProductData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchNumberOfItems.fulfilled, (state, action) => {
        state.totalNumberOfItems = action.payload;
      })

      .addCase(fetchSearchItems.fulfilled, (state, action) => {
        state.products.search.products = action.payload;
      })

      .addCase(fetchNumberOfSearchItems.fulfilled, (state, action) => {
        state.products.search.totalNumberOfItems = action.payload;
      });
  },
});

export default appSlice;
