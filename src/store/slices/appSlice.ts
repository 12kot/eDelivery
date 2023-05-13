import {
  BannerType,
  ProductCategoriesType,
  ProductType,
} from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AppType = {
  categories: CategoryType[];
  banners: BannerType[];
  products: ProductCategoriesType;
};

const initialState: AppType = {
  categories: [
    { category: "Акции", link: "actions" },
    { category: "Скидки", link: "sales" },
    { category: "Напитки", link: "category/drinks" },
    { category: "Фрукты", link: "category/fruits" },
    { category: "Овощи", link: "category/vegetables" },
    { category: "Бакалея", link: "category/Grocery" },
    { category: "Детское питание", link: "category/child" },
    { category: "Молочные продукты", link: "category/milk" },
  ],
  products: {
   products: []
  },

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
    setProductCategory(state, action: PayloadAction<ProductType[]>) {
      state.products.products = action.payload;
      state.products.milk = action.payload;
    },
  },
});

export const { setCategories, setBanners, setProductCategory } = appSlice.actions;
export default appSlice;
