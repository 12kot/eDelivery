import DeleteDoc from "API/DB/DeleteDoc";
import { RootState } from "./../index";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FindDoc from "API/DB/FindDoc";
import GetCol from "API/DB/GetCol";
import SetDoc from "API/DB/SetDoc";
import CreateWithEmailAndPassword from "API/auth/CreateWithEmail";
import LoginByEmail from "API/auth/LoginByEmail";
import LoginByGoogle from "API/auth/LoginByGoogle";
import Logout from "API/auth/Logout";
import { useAppSelector } from "hooks/hooks";
import { AddressType, AuthUser, CurrentUser, ProductType } from "types/types";

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
    basket: "",
    favorite: [],
  },
  isLoading: false,
};

export const fetchUserFavorite = createAsyncThunk<void, { userEmail: string }>(
  "user/fetchuserFavorite",
  async function (props, { dispatch }) {
    const favorite: ProductType[] = await GetCol(props.userEmail, "favorite");
    dispatch(setCurrentUserFavorite(favorite));
  }
);

export const fetchUserAddresses = createAsyncThunk<void, { userEmail: string }>(
  "user/fetchuserAddresses",
  async function (props, { dispatch }) {
    const addresses: AddressType[] = await GetCol(props.userEmail, "addresses");
    dispatch(setCurrentUserAddresses(addresses));
  }
);

export const fetchUserBasket = createAsyncThunk<void, { userEmail: string }>(
  "user/fetchUserBasket",
  async function (props, { dispatch }) {
    const basket: ProductType[] = await GetCol(props.userEmail, "basket");
    dispatch(setCurrentUserBasket(basket));
  }
);

export const fetchUserData = createAsyncThunk<void, { user: AuthUser }>(
  "user/fetchUserData",
  async function (props, { dispatch }) {
    dispatch(setCurrentUser(props.user));
    dispatch(fetchUserFavorite({ userEmail: props.user.email }));
    dispatch(fetchUserBasket({ userEmail: props.user.email }));
    dispatch(fetchUserAddresses({ userEmail: props.user.email }));
  }
);

export const loginUserByGoogle = createAsyncThunk<void>(
  "user/loginUserByGoogle",
  async function (_, { dispatch }) {
    dispatch(setIsLoading(true));

    let data = await LoginByGoogle();
    if (data.email) {
      dispatch(fetchUserData({ user: data }));
    }

    dispatch(setIsLoading(false));
  }
);

export const loginUserByEmail = createAsyncThunk<
  void,
  { email: string; password: string }
>("user/loginUserByEmail", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));

  let data = await LoginByEmail(props.email, props.password);
  if (data.email) {
    dispatch(fetchUserData({ user: data }));
  }

  dispatch(setIsLoading(false));
});

export const createUserWithEmail = createAsyncThunk<
  void,
  { email: string; password: string; repeatPassword: string }
>("user/createUserWithEmail", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));
  //ВАЛИДАЦИЯ. СОЗДАТЬ ЯЧЕЙКУ В БД
  let data: AuthUser = await CreateWithEmailAndPassword(
    props.email,
    props.password
  );
  if (data.email) {
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
>("user/addFavoriteProduct", async function (props, { getState, dispatch }) {
  const userEmail = getState().user.currentUser.email;
  const isExist: ProductType = await FindDoc(
    userEmail,
    "favorite",
    props.product.id
  );

  if (!!isExist) {
    await DeleteDoc(userEmail, "favorite", props.product.id)
    dispatch(removeFavoriteProduct(props.product));
  } else {
    await SetDoc(userEmail, "favorite", props.product);
    dispatch(addFavoriteProduct(props.product));
  }
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
    setCurrentUserBasket(state, action: PayloadAction<ProductType[]>) {
      //state.currentUser.basket = action.payload;
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
} = userSlice.actions;
export default userSlice;
