import { BannerType, ProductType } from "./../../types/types";
import { CategoryType } from "types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AppType = {
  categories: CategoryType[];
  products: ProductType[];
  /* 
  products: {
    milk: {},
    drinks: {},
    fruits: {},
    ...
    vegetables: {},
  }
  */
  banners: BannerType[];
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
  products: [
    {
      name: "string",
      id: 1,
      price: 1,
      description: "Lormmy tenturies, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },
    {
      name: "string",
      id: 1,
      price: 1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },{
      name: "string",
      id: 1,
      price: 1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },{
      name: "string",
      id: 1,
      price: 1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },{
      name: "string",
      id: 1,
      price: 1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },{
      name: "string",
      id: 1,
      price: 1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ",
      composition: "string",
      quantity: 1,
      imageURL: "https://api.e-dostavka.by/UserFiles/images/catalog/Goods/4210/01794210/norm/01794210.n_1.png",
      category: "string",
      location: "Belarus",
    },
  ],
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
    setProducts(state, action: PayloadAction<ProductType[]>) {
      state.products = action.payload;
    },
  },
});

export const { setCategories, setBanners, setProducts } = appSlice.actions;
export default appSlice;
