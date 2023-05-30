import DeleteDoc from "API/DB/DeleteDoc";
import { RootState } from "./../index";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FindDocInCollection from "API/DB/FindDocInCollection";
import GetCollection from "API/DB/GetCollection";
import SetDoc from "API/DB/SetDoc";
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
import { v4 } from "uuid";
import UpdateProfileInfo from "API/DB/UpdateProfileInfo";
import GetUserData from "API/DB/GetUserData";

type UserSlice = {
  currentUser: CurrentUser;
  isLoading: boolean;
};

const emptyAddress = {
  city: "",
  street: "",
  houseNumber: "",
  block: "",
  entrance: "",
  floor: "",
  flat: "",
  id: "",
};

const initialState: UserSlice = {
  currentUser: {
    email: "",
    uid: "",
    token: "",
    addresses: [],
    currentAddress: emptyAddress,
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
    let data: ProductType[] = await getItemsDB(
      "products/products",
      "id",
      item,
      1
    );

    if (data[0].id) products.push(data[0]);
  }

  return products;
};

export const fetchUserFavorite = createAsyncThunk<
  { items: number[]; products: ProductType[] },
  undefined,
  { state: RootState }
>("user/fetchUserFavorite", async (_, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  const items: { id: number }[] = await GetCollection(userUID, "favorite");
  const products: ProductType[] = await _getItems(items.map((item) => item.id));

  return {
    items: items.map((item) => item.id),
    products: products,
  };
});

export const fetchUserAddresses = createAsyncThunk<
  AddressType[],
  undefined,
  { state: RootState }
>("user/fetchUserAddresses", async (_, { getState }) => {
  const addresses: AddressType[] = await GetCollection(
    getState().user.currentUser.uid,
    "addresses"
  );

  return addresses;
});

export const fetchUserBasket = createAsyncThunk<
  { items: BasketItemType[]; products: ProductType[] },
  undefined,
  { state: RootState }
>("user/fetchUserBasket", async (_, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  const items: BasketItemType[] = await GetCollection(userUID, "basket");
  const products: ProductType[] = await _getItems(items.map((item) => item.id));

  return { items: items, products: products };
});

export const fetchUserData = createAsyncThunk<
  AuthUser,
  AuthUser,
  { state: RootState }
>("user/fetchUserData", async function (props, { dispatch, rejectWithValue }) {
  const user: AuthUser | undefined = await GetUserData(props.uid);
  if (!user?.uid) return rejectWithValue("Пользователь не найден");

  dispatch(fetchUserFavorite());
  dispatch(fetchUserBasket());
  dispatch(fetchUserAddresses());

  return user as AuthUser;
});

export const loginUserByGoogle = createAsyncThunk<
  undefined,
  undefined,
  { state: RootState }
>("user/loginUserByGoogle", async (_, { dispatch, rejectWithValue }) => {
  let data: AuthUser = await LoginByGoogle();
  if (data.email) {
    await CreateUser(data);
    dispatch(fetchUserData(data));
    return;
  }

  return rejectWithValue("Error");
});

export const loginUserByEmail = createAsyncThunk<
  undefined,
  { email: string; password: string },
  { state: RootState }
>("user/loginUserByEmail", async (props, { dispatch, rejectWithValue }) => {
  let data: AuthUser = await LoginByEmail(props.email, props.password);
  if (data.email) {
    dispatch(fetchUserData(data));
    return;
  }

  return rejectWithValue("Error");
});

export const createUserWithEmail = createAsyncThunk<
  undefined,
  { email: string; password: string; repeatPassword: string },
  { state: RootState }
>("user/createUserWithEmail", async (props, { dispatch, rejectWithValue }) => {
  //ВАЛИДАЦИЯ
  let data: AuthUser = await CreateWithEmailAndPassword(
    props.email,
    props.password
  );

  if (data.email) {
    await CreateUser(data);
    dispatch(fetchUserData(data));
    return;
  }

  return rejectWithValue("Error");
});

export const logoutUser = createAsyncThunk<void>(
  "user/logoutUser",
  async () => {
    await Logout();
  }
);

export const handleFavoriteProduct = createAsyncThunk<
  { type: string; id: number },
  { productID: number },
  { state: RootState }
>("user/handleFavoriteProduct", async (props, { getState }) => {
  const userUID = getState().user.currentUser.uid;
  const isExists: ProductType = await FindDocInCollection(
    userUID,
    "favorite",
    "id",
    props.productID
  );

  if (!!isExists) {
    await DeleteDoc(userUID, "favorite", props.productID.toString());
    return { type: "DELETE", id: props.productID };
  } else {
    await SetDoc(userUID, "favorite", props.productID.toString(), {
      id: props.productID,
    });
    return { type: "ADD", id: props.productID };
  }
});

export const handleBasketProduct = createAsyncThunk<
  { type: string; basketItem: BasketItemType },
  { basketItem: BasketItemType },
  { state: RootState }
>("user/handleBasketProduct", async (props, { getState, rejectWithValue }) => {
  const product: ProductType[] = await getItemsDB(
    "products/products",
    "id",
    props.basketItem.id,
    1
  );

  if (!product[0]) {
    return rejectWithValue("Error");
  }

  if (product[0].quantity < props.basketItem.count) {
    return rejectWithValue("Error");
  }

  const userUID = getState().user.currentUser.uid;
  const isExists: ProductType = await FindDocInCollection(
    userUID,
    "basket",
    "id",
    props.basketItem.id
  );

  if (!!isExists) {
    if (props.basketItem.count === 0) {
      await DeleteDoc(userUID, "basket", props.basketItem.id.toString());
      return { type: "REMOVE", basketItem: props.basketItem };
    }

    await UpdateBasketDoc(userUID, "basket", props.basketItem);
    return { type: "SET_COUNT", basketItem: props.basketItem };
  }

  await SetDoc(userUID, "basket", props.basketItem.id.toString(), {
    id: props.basketItem.id,
    count: props.basketItem.count,
  });
  return { type: "ADD", basketItem: props.basketItem };
});

//ДОРАБОТКИ НЕ ТРЕБУЮТСЯ
export const handleAddress = createAsyncThunk<
  AddressType,
  AddressType,
  { state: RootState }
>(
  "user/handleAddress",
  async (props, { getState, rejectWithValue, dispatch }) => {
    if (!props.city || !props.street || !props.houseNumber) {
      return rejectWithValue("Введены не все данные");
    }

    const userUID = getState().user.currentUser.uid;
    if (!props.id) props.id = v4();
    await SetDoc(userUID, "addresses", props.id, props);

    dispatch(setCurrentAddress(props));

    return props;
  }
);

export const deleteAddress = createAsyncThunk<
  string,
  { id: string },
  { state: RootState }
>("user/deleteAddress", async (props, { dispatch, getState }) => {
  const userUID = getState().user.currentUser.uid;
  await DeleteDoc(userUID, "addresses", props.id);

  if (getState().user.currentUser.currentAddress.id === props.id)
    dispatch(setCurrentAddress(emptyAddress));

  return props.id;
});

export const setCurrentAddress = createAsyncThunk<
  AddressType,
  AddressType,
  { state: RootState }
>("user/setCurrentAddress", async (props, { getState }) => {
  const userUID = getState().user.currentUser.uid;
  await UpdateProfileInfo(userUID, { currentAddress: props });

  return props;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.currentUser = initialState.currentUser;
        localStorage.clear();
        state.isLoading = false;
      })

      .addCase(fetchUserFavorite.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserFavorite.fulfilled, (state, action) => {
        state.currentUser.favorite = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchUserAddresses.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.currentUser.addresses = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchUserBasket.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserBasket.fulfilled, (state, action) => {
        state.currentUser.basket = action.payload;
        state.isLoading = false;
      })

      .addCase(loginUserByGoogle.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginUserByGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loginUserByGoogle.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(loginUserByEmail.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginUserByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loginUserByEmail.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(createUserWithEmail.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createUserWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createUserWithEmail.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = initialState.currentUser;
      })

      .addCase(handleFavoriteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleFavoriteProduct.fulfilled, (state, action) => {
        if (action.payload.type === "DELETE") {
          state.currentUser.favorite.items =
            state.currentUser.favorite.items.filter(
              (product) => product !== action.payload.id
            );

          state.currentUser.favorite.products =
            state.currentUser.favorite.products.filter(
              (product) => product.id !== action.payload.id
            );
        } else {
          state.currentUser.favorite.items.push(action.payload.id);
        }

        state.isLoading = false;
      })

      .addCase(handleBasketProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(handleBasketProduct.fulfilled, (state, action) => {
        switch (action.payload.type) {
          case "ADD":
            state.currentUser.basket.items.push(action.payload.basketItem);
            break;
          case "REMOVE":
            state.currentUser.basket.items =
              state.currentUser.basket.items.filter(
                (product) => product.id !== action.payload.basketItem.id
              );

            state.currentUser.basket.products =
              state.currentUser.basket.products.filter(
                (product) => product.id !== action.payload.basketItem.id
              );
            break;
          case "SET_COUNT":
            state.currentUser.basket.items.forEach((product) => {
              if (product.id === action.payload.basketItem.id)
                product.count = action.payload.basketItem.count;
            });
        }

        state.isLoading = false;
      })
      .addCase(handleBasketProduct.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(handleAddress.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(handleAddress.fulfilled, (state, action) => {
        const index = state.currentUser.addresses.findIndex(
          (address) => address.id === action.payload.id
        );

        if (index === -1) {
          state.currentUser.addresses.push(action.payload);
        } else state.currentUser.addresses[index] = action.payload;

        state.isLoading = false;
      })
      .addCase(handleAddress.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(deleteAddress.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.currentUser.addresses = state.currentUser.addresses.filter(
          (address) => address.id !== action.payload
        );

        state.isLoading = false;
      })

      .addCase(setCurrentAddress.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(setCurrentAddress.fulfilled, (state, action) => {
        state.currentUser.currentAddress = action.payload;
        state.isLoading = false;
      });
  },
});

export default userSlice;
