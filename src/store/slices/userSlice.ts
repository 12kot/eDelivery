import DeleteDoc from "API/DB/DeleteDoc";
import { RootState } from "./../index";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FindDoc from "API/DB/FindDoc";
import GetCol from "API/DB/GetCol";
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

type UserSlice = {
  currentUser: CurrentUser;
  isLoading: boolean;
};

const initialState: UserSlice = {
  currentUser: {
    email: "",
    uid: "",
    token: "",
    addresses: [],
    currentAddress: {
      city: "",
      street: "",
      houseNumber: "",
      block: "",
      entrance: "",
      floor: "",
      flat: "",
      id: "",
    },
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

  const items: { id: number }[] = await GetCol(userUID, "favorite");
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
  const addresses: AddressType[] = await GetCol(
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

  const items: BasketItemType[] = await GetCol(userUID, "basket");
  const products: ProductType[] = await _getItems(items.map((item) => item.id));

  return { items: items, products: products };
});

export const fetchUserData = createAsyncThunk<
  void,
  AuthUser,
  { state: RootState }
>("user/fetchUserData", async function (props, { getState, dispatch }) {
  //можно проверку на юзера сделать
  dispatch(setUser(props));

  dispatch(fetchUserFavorite());
  dispatch(fetchUserBasket());
  dispatch(fetchUserAddresses());
});

export const loginUserByGoogle = createAsyncThunk<
  AuthUser,
  undefined,
  { state: RootState }
>("user/loginUserByGoogle", async (_, { dispatch, rejectWithValue }) => {
  let data: AuthUser = await LoginByGoogle();
  if (data.email) {
    await CreateUser(data);
    dispatch(fetchUserData(data));
    return data;
  }

  return rejectWithValue("Error");
});

export const loginUserByEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { state: RootState }
>("user/loginUserByEmail", async (props, { dispatch, rejectWithValue }) => {
  let data: AuthUser = await LoginByEmail(props.email, props.password);
  if (data.email) {
    dispatch(fetchUserData(data));
    return data;
  }

  return rejectWithValue("Error");
});

export const createUserWithEmail = createAsyncThunk<
  AuthUser,
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
    return data;
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
  const isExists: ProductType = await FindDoc(
    userUID,
    "favorite",
    "id",
    props.productID
  );

  if (!!isExists) {
    await DeleteDoc(userUID, "favorite", props.productID);
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
  const isExists: ProductType = await FindDoc(
    userUID,
    "basket",
    "id",
    props.basketItem.id
  );

  if (!!isExists) {
    if (props.basketItem.count === 0) {
      await DeleteDoc(userUID, "basket", props.basketItem.id);
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
>("user/handleAddress", async (props, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  if (!props.id) props.id = v4();
  await SetDoc(userUID, "addresses", props.id, props);

  return props;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser.email = action.payload.email;
      state.currentUser.uid = action.payload.uid;
      state.currentUser.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
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
        if (true) {
          //если адреса нет в базе, то добавляем. Проверяем по ID в цикле for, сразу редактируя, если надо
          state.currentUser.addresses.push(action.payload);
          state.currentUser.currentAddress = action.payload;
        }

        state.isLoading = false;
      });
  },
});

const { setUser } = userSlice.actions;
export default userSlice;
