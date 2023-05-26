import DeleteDoc from "API/DB/DeleteDoc";
import { RootState } from "./../index";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FindDoc from "API/DB/FindDoc";
import GetCol from "API/DB/GetCol";
import SetProduct from "API/DB/SetProduct";
import CreateWithEmailAndPassword from "API/auth/CreateWithEmail";
import LoginByEmail from "API/auth/LoginByEmail";
import LoginByGoogle from "API/auth/LoginByGoogle";
import Logout from "API/auth/Logout";
import {
  AddressType,
  AuthUser,
  BasketItemType,
  CurrentUser,
  ProductType,
} from "types/types";
import CreateUser from "API/DB/CreateUser";
import getItemsDB from "API/realtimeDB/getItemsDB";
import UpdateBasketDoc from "API/DB/UpdateBasketDoc";

type UserSlice = {
  currentUser: CurrentUser;
  isLoading: boolean;
};

const initialState: UserSlice = {
  currentUser: {
    email: "",
    uid: "",
    token: "",
    address: [],
    basket: {
      products: [],
      items: [],
    },
    favorite: {
      products: [],
      items: [],
    },
  },
  isLoading: false,
};

const _getItems = async (productsID: number[]) => {
  let products: ProductType[] = [];

  for (const item of productsID) {
    console.log(item);
    let data: ProductType[] = await getItemsDB(
      "products/products",
      "id",
      item,
      1
    );
    console.log(data);
    if (data[0].id) products.push(data[0]);
  }

  return products;
};

export const fetchUserFavorite = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/fetchUserFavorite", async function (_, { dispatch, getState }) {
  dispatch(setIsLoading(true));
  const userUID = getState().user.currentUser.uid;

  const items: { id: number }[] = await GetCol(userUID, "favorite");
  const products: ProductType[] = await _getItems(items.map((item) => item.id));

  dispatch(
    setCurrentUserFavorite({
      items: items.map((item) => item.id),
      products: products,
    })
  );
  
  dispatch(setIsLoading(false));
});

export const fetchUserAddresses = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/fetchUserAddresses", async function (_, { dispatch, getState }) {
  dispatch(setIsLoading(true));

  const addresses: AddressType[] = await GetCol(
    getState().user.currentUser.uid,
    "addresses"
  );
  dispatch(setCurrentUserAddresses(addresses));

  dispatch(setIsLoading(false));
});

export const fetchUserBasket = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/fetchUserBasket", async function (_, { dispatch, getState }) {
  dispatch(setIsLoading(true));
  const userUID = getState().user.currentUser.uid;

  const items: BasketItemType[] = await GetCol(userUID, "basket");
  const products: ProductType[] = await _getItems(items.map((item) => item.id));

  dispatch(setCurrentUserBasket({ items: items, products: products }));
  dispatch(setIsLoading(false));
});

export const fetchUserData = createAsyncThunk<
  void,
  { user: AuthUser },
  { state: RootState }
>("user/fetchUserData", async function (props, { dispatch, getState }) {
  //можно проверку на юзера сделать
  dispatch(setCurrentUser(props.user));
  dispatch(fetchUserFavorite());
  dispatch(fetchUserBasket());
  dispatch(fetchUserAddresses());
});

export const loginUserByGoogle = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/loginUserByGoogle", async function (_, { dispatch }) {
  dispatch(setIsLoading(true));

  let data: AuthUser = await LoginByGoogle();
  if (data.email) {
    CreateUser(data);
    dispatch(fetchUserData({ user: data }));
  }

  dispatch(setIsLoading(false));
});

export const loginUserByEmail = createAsyncThunk<
  void,
  { email: string; password: string },
  { state: RootState }
>("user/loginUserByEmail", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));

  let data: AuthUser = await LoginByEmail(props.email, props.password);
  if (data.email) {
    dispatch(fetchUserData({ user: data }));
  }

  dispatch(setIsLoading(false));
});

export const createUserWithEmail = createAsyncThunk<
  void,
  { email: string; password: string; repeatPassword: string },
  { state: RootState }
>("user/createUserWithEmail", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));
  //ВАЛИДАЦИЯ. СОЗДАТЬ ЯЧЕЙКУ В БД
  let data: AuthUser = await CreateWithEmailAndPassword(
    props.email,
    props.password
  );

  if (data.email) {
    CreateUser(data);
    dispatch(fetchUserData({ user: data }));
  }

  dispatch(setIsLoading(false));
});

export const logoutUser = createAsyncThunk<void>(
  "user/logoutUser",
  async function (_, { dispatch }) {
    await Logout();
    dispatch(removeCurrentUser());
  }
);

export const handleFavoriteProduct = createAsyncThunk<
  void,
  { productID: number },
  { state: RootState }
>("user/handleFavoriteProduct", async function (props, { getState, dispatch }) {
  dispatch(setIsLoading(true));

  const userUID = getState().user.currentUser.uid;
  const isExists: ProductType = await FindDoc(
    userUID,
    "favorite",
    "id",
    props.productID
  );

  if (!!isExists) {
    await DeleteDoc(userUID, "favorite", props.productID);
    dispatch(removeFavoriteProduct(props.productID));
  } else {
    await SetProduct(userUID, "favorite", props.productID);
    dispatch(addFavoriteProduct(props.productID));
  }

  dispatch(setIsLoading(false));
});

export const handleBasketProduct = createAsyncThunk<
  void,
  { basketItem: BasketItemType },
  { state: RootState }
>("user/handleBasketProduct", async function (props, { dispatch, getState }) {
  dispatch(setIsLoading(true));

  const product: ProductType[] = await getItemsDB(
    "products/products",
    "id",
    props.basketItem.id,
    1
  );

  if (!product[0]) {
    dispatch(setIsLoading(false));
    return;
  }

  if (product[0].quantity < props.basketItem.count) {
    dispatch(setIsLoading(false));
    return;
  }

  const userUID = getState().user.currentUser.uid;
  const isExists: ProductType = await FindDoc(
    userUID,
    "basket",
    "id",
    props.basketItem.id
  );

  if (!!isExists) {
    if (props.basketItem.count === 0) {
      await DeleteDoc(userUID, "basket", props.basketItem.id);
      dispatch(removeProductBasket(props.basketItem.id));
    } else await UpdateBasketDoc(userUID, "basket", props.basketItem);
    dispatch(
      setCountProductToBasket({
        id: props.basketItem.id,
        count: props.basketItem.count,
      })
    );
  } else {
    await SetProduct(
      userUID,
      "basket",
      props.basketItem.id,
      props.basketItem.count
    );
    dispatch(addProductToBasket(props.basketItem));
  }

  dispatch(setIsLoading(false));
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<AuthUser>) {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setCurrentUserFavorite(
      state,
      action: PayloadAction<{ items: number[]; products: ProductType[] }>
    ) {
      state.currentUser.favorite = action.payload;
    },
    setCurrentUserAddresses(state, action: PayloadAction<AddressType[]>) {
      state.currentUser.address = action.payload;
    },
    setCurrentUserBasket(
      state,
      action: PayloadAction<{
        items: BasketItemType[];
        products: ProductType[];
      }>
    ) {
      state.currentUser.basket.items = action.payload.items;
      state.currentUser.basket.products = action.payload.products;
    },
    removeCurrentUser(state) {
      state.currentUser = initialState.currentUser;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addFavoriteProduct(state, action: PayloadAction<number>) {
      state.currentUser.favorite.items.push(action.payload);
    },
    removeFavoriteProduct(state, action: PayloadAction<number>) {
      state.currentUser.favorite.items =
        state.currentUser.favorite.items.filter(
          (product) => product !== action.payload
        );

      state.currentUser.favorite.products =
        state.currentUser.favorite.products.filter(
          (product) => product.id !== action.payload
        );
    },
    addProductToBasket(state, action: PayloadAction<BasketItemType>) {
      state.currentUser.basket.items.push(action.payload);
    },
    setCountProductToBasket(
      state,
      action: PayloadAction<{ id: number; count: number }>
    ) {
      state.currentUser.basket.items.forEach((product) => {
        if (product.id === action.payload.id)
          product.count = action.payload.count;
      });
    },
    removeProductBasket(state, action: PayloadAction<number>) {
      state.currentUser.basket.items = state.currentUser.basket.items.filter(
        (product) => product.id !== action.payload
      );

      state.currentUser.basket.products =
        state.currentUser.basket.products.filter(
          (product) => product.id !== action.payload
        );
    },
  },
});

const {
  setCurrentUser,
  setCurrentUserFavorite,
  setCurrentUserBasket,
  setCurrentUserAddresses,
  setIsLoading,
  removeCurrentUser,
  addFavoriteProduct,
  removeFavoriteProduct,
  addProductToBasket,
  setCountProductToBasket,
  removeProductBasket,
} = userSlice.actions;
export default userSlice;
