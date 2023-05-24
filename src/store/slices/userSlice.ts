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
    basket: [],
    favorite: [],
  },
  isLoading: false,
};

export const fetchUserFavorite = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/fetchuserFavorite", async function (_, { dispatch, getState }) {
  dispatch(setIsLoading(true));

  const favorite: ProductType[] = await GetCol(
    getState().user.currentUser.uid,
    "favorite"
  );
  dispatch(setCurrentUserFavorite(favorite));

  dispatch(setIsLoading(false));
});

export const fetchUserAddresses = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/fetchuserAddresses", async function (_, { dispatch, getState }) {
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

  const basket: BasketItemType[] = await GetCol(
    getState().user.currentUser.uid,
    "basket"
  );
  dispatch(setCurrentUserBasket(basket));

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
  { product: ProductType },
  { state: RootState }
>("user/handleFavoriteProduct", async function (props, { getState, dispatch }) {
  dispatch(setIsLoading(true));

  const userUID = getState().user.currentUser.uid;
  const isExists: ProductType = await FindDoc(
    userUID,
    "favorite",
    "id",
    props.product.id
  );

  if (!!isExists) {
    await DeleteDoc(userUID, "favorite", props.product.id);
    dispatch(removeFavoriteProduct(props.product));
  } else {
    await SetProduct(userUID, "favorite", props.product);
    dispatch(addFavoriteProduct(props.product));
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
    props.basketItem.product.id,
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
    "product.id",
    props.basketItem.product.id
  );

  if (!!isExists) {
    if (props.basketItem.count === 0) {
      await DeleteDoc(userUID, "basket", props.basketItem.product.id);
      dispatch(removeProductBasket(props.basketItem.product.id));
    } else await UpdateBasketDoc(userUID, "basket", props.basketItem);
    dispatch(
      setCountProductToBasket({
        productID: props.basketItem.product.id,
        count: props.basketItem.count,
      })
    );
  } else {
    await SetProduct(
      userUID,
      "basket",
      props.basketItem.product,
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
    setCurrentUserFavorite(state, action: PayloadAction<ProductType[]>) {
      state.currentUser.favorite = action.payload;
    },
    setCurrentUserAddresses(state, action: PayloadAction<AddressType[]>) {
      state.currentUser.address = action.payload;
    },
    setCurrentUserBasket(state, action: PayloadAction<BasketItemType[]>) {
      state.currentUser.basket = action.payload;
    },
    removeCurrentUser(state) {
      state.currentUser = initialState.currentUser;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addFavoriteProduct(state, action: PayloadAction<ProductType>) {
      state.currentUser.favorite.push(action.payload);
    },
    removeFavoriteProduct(state, action: PayloadAction<ProductType>) {
      state.currentUser.favorite = state.currentUser.favorite.filter(
        (product) => product.id !== action.payload.id
      );
    },
    addProductToBasket(state, action: PayloadAction<BasketItemType>) {
      state.currentUser.basket.push(action.payload);
    },
    setCountProductToBasket(
      state,
      action: PayloadAction<{ productID: number; count: number }>
    ) {
      state.currentUser.basket.forEach((product) => {
        if (product.product.id === action.payload.productID)
          product.count = action.payload.count;
      });
    },
    removeProductBasket(state, action: PayloadAction<number>) {
      state.currentUser.basket = state.currentUser.basket.filter(
        (product) => product.product.id !== action.payload
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
