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
  BasketType,
  CurrentUser,
  CurrentUserData,
  NotificationsType,
  OrderProductType,
  OrderType,
  ProductType,
} from "types/types";
import CreateUser from "API/DB/CreateUser";
import getItemsDB from "API/realtimeDB/getItemsDB";
import UpdateDoc from "API/DB/UpdateDoc";
import { v4 } from "uuid";
import UpdateProfileInfo from "API/DB/UpdateProfileInfo";
import GetUserData from "API/DB/GetUserData";
import editItem from "API/realtimeDB/editItem";
import AuthValidate from "functions/AuthValidate";
import { hideNotifications, setNotification } from "./notificationsSlice";

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
    history: [],
    openedOrder: {
      id: -1,
      price: -1,
      date: "",
      products: [],
      address: emptyAddress,
      status: "WAITING",
    },
    userData: {
      firstName: "",
      lastName: "",
      middleName: "",
      phoneNumber: "",
      gender: "",
    },
  },
  isLoading: false,
};

const _getItems = async (productsID: number[]): Promise<ProductType[]> => {
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

const _getOrderProducts = (basket: BasketType): OrderProductType[] => {
  const products: OrderProductType[] = basket.products.map((product) => {
    const itemIndex = basket.items.findIndex((item) => item.id === product.id);

    return {
      imageURL: product.imageURL,
      name: product.name,
      price: product.price,
      count: basket.items[itemIndex].count,
      id: product.id,
    };
  });

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

export const fetchUserHistory = createAsyncThunk<
  { history: OrderType[] },
  undefined,
  { state: RootState }
>("user/fetchUserHistory", async (_, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  const history: OrderType[] = await GetCollection(userUID, "history");

  return { history };
});

export const fetchUserData = createAsyncThunk<
  AuthUser,
  AuthUser,
  { state: RootState }
>("user/fetchUserData", async function (props, { dispatch, rejectWithValue }) {
  const user: AuthUser | undefined = await GetUserData(props.uid);
  if (!user?.uid) {
    dispatch(
      _notify({
        type: "ERROR",
        header: "Время сессии истекло",
        description: "Авторизуйтесь заново",
      })
    );

    return rejectWithValue("");
  }

  return user as AuthUser;
});

export const loginUserByGoogle = createAsyncThunk<
  undefined,
  undefined,
  { state: RootState }
>("user/loginUserByGoogle", async (_, { dispatch, rejectWithValue }) => {
  let data: { data: AuthUser; error: Error | null } = await LoginByGoogle();
  if (!data.error) {
    await CreateUser(data.data);
    dispatch(fetchUserData(data.data));
    dispatch(fetchUserAddresses());

    return;
  }

  dispatch(
    _notify({
      type: "ERROR",
      header: "Неудача",
      description: data.error.message,
    })
  );

  return rejectWithValue("");
});

export const loginUserByEmail = createAsyncThunk<
  undefined,
  { email: string; password: string },
  { state: RootState }
>("user/loginUserByEmail", async (props, { dispatch, rejectWithValue }) => {
  props.email = props.email.trim();
  const validate = new AuthValidate(props.email, props.password);
  if (!validate.EmailValidator() || !validate.PassValidator) {
    dispatch(
      _notify({
        type: "ERROR",
        header: "Неудача",
        description: validate.GetErrorMessage(),
      })
    );

    return rejectWithValue("");
  }

  let data: { data: AuthUser; error: Error | null } = await LoginByEmail(
    props.email,
    props.password
  );

  if (!data.error) {
    dispatch(fetchUserData(data.data));
    dispatch(fetchUserAddresses());
    return;
  }

  dispatch(
    _notify({
      type: "ERROR",
      header: "Неудача",
      description: data.error.message,
    })
  );

  return rejectWithValue("");
});

export const createUserWithEmail = createAsyncThunk<
  undefined,
  { email: string; password: string; repeatPassword: string },
  { state: RootState }
>("user/createUserWithEmail", async (props, { dispatch, rejectWithValue }) => {
  props.email = props.email.trim();

  const validate = new AuthValidate(
    props.email,
    props.password,
    props.repeatPassword
  );

  if (
    !validate.EmailValidator() ||
    !validate.PassValidator() ||
    !validate.RepeatPassValidator()
  ) {
    dispatch(
      _notify({
        type: "ERROR",
        header: "Неудача",
        description: validate.GetErrorMessage(),
      })
    );
    return rejectWithValue("");
  }

  let data: { data: AuthUser; error: Error | null } =
    await CreateWithEmailAndPassword(props.email, props.password);

  if (!data.error) {
    await CreateUser(data.data);
    dispatch(fetchUserData(data.data));
    return;
  }

  dispatch(
    _notify({
      type: "ERROR",
      header: "Неудача",
      description: data.error.message,
    })
  );
  return rejectWithValue("");
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
  { basketItem: BasketItemType; type: string },
  { state: RootState }
>(
  "user/handleBasketProduct",
  async (props, { getState, rejectWithValue, dispatch }) => {
    const product: ProductType[] = await getItemsDB(
      "products/products",
      "id",
      props.basketItem.id,
      1
    );

    if (!product[0]) {
      dispatch(
        _notify({
          type: "ERROR",
          header: "Неудача",
          description: "Не удалось найти продукт. Повторите попытку позже",
        })
      );
      return rejectWithValue("");
    }

    console.log(props.basketItem.count)
    if ((product[0].quantity <= 0 && props.type === "PLUS") || props.basketItem.count < 0) {
      dispatch(
        _notify({
          type: "ERROR",
          header: "Выбранный продукт закончился",
          description:
            "Извините, данный продукт закончился. Но совсем скоро он появится на нашем складе",
        })
      );
      return rejectWithValue("");
    }

    if (props.type === "PLUS") product[0].quantity = --product[0].quantity;
    else product[0].quantity = ++product[0].quantity;
    await editItem(product[0].id, { quantity: product[0].quantity });

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

      await UpdateDoc(userUID, "basket", props.basketItem.id.toString(), {
        count: props.basketItem.count,
      });

      return { type: "SET_COUNT", basketItem: props.basketItem };
    }

    await SetDoc(userUID, "basket", props.basketItem.id.toString(), {
      id: props.basketItem.id,
      count: props.basketItem.count,
    });

    return { type: "ADD", basketItem: props.basketItem };
  }
);

export const handleAddress = createAsyncThunk<
  AddressType,
  AddressType,
  { state: RootState }
>(
  "user/handleAddress",
  async (props, { getState, rejectWithValue, dispatch }) => {
    if (
      !props.city.trim() ||
      !props.street.trim() ||
      !props.houseNumber.trim()
    ) {
      dispatch(
        _notify({
          type: "ERROR",
          header: "Неудача",
          description: "Введены не все обязательные данные",
        })
      );
      return rejectWithValue("");
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

export const createOrder = createAsyncThunk<
  OrderType,
  { price: number },
  { state: RootState }
>(
  "user/createOrder",
  async (props, { getState, dispatch, rejectWithValue }) => {
    const userUID = getState().user.currentUser.uid;

    if (!getState().user.currentUser.currentAddress.id) {
      dispatch(
        _notify({
          type: "ERROR",
          header: "Неудача",
          description: "Выберите адрес доставки",
        })
      );

      return rejectWithValue("");
    }

    dispatch(fetchUserBasket());
    dispatch(fetchUserHistory());

    const order: OrderType = {
      id: getState().user.currentUser.history.length + 1,
      price: props.price,
      date: new Date().toDateString(),
      products: _getOrderProducts(getState().user.currentUser.basket),
      address: getState().user.currentUser.currentAddress,
      status: "WAITING",
    };

    await SetDoc(userUID, "history", order.id.toString(), order);
    for (const item of getState().user.currentUser.basket.items)
      await DeleteDoc(userUID, "basket", item.id.toString());

    dispatch(
      _notify({
        type: "SUCCESS",
        header: "Заказ собран",
        description:
          "Заказ успешно собран. Подтвердите правильность в истории заказов",
      })
    );
    return order;
  }
);

export const handleOrderStatus = createAsyncThunk<
  { id: number; status: "ACCEPTED" | "CANCELED" | "WAITING" },
  { id: number; status: "ACCEPTED" | "CANCELED" | "WAITING" },
  { state: RootState }
>("user/handleOrderStatus", async (props, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  if (props.status === "CANCELED") {
    const order: OrderType = await FindDocInCollection(
      userUID,
      "history",
      "id",
      props.id
    );

    for (const product of order.products) {
      let data: ProductType[] = await getItemsDB(
        "products/products",
        "id",
        product.id,
        1
      );

      await editItem(product.id, {
        quantity: data[0].quantity + 1 * product.count,
      });
    }
  }

  await UpdateDoc(userUID, "history", props.id.toString(), {
    status: props.status,
  });

  return props;
});

export const fetchOrder = createAsyncThunk<
  OrderType,
  { id: number },
  { state: RootState }
>("user/fetchOrder", async (props, { getState, rejectWithValue, dispatch }) => {
  const userUID = getState().user.currentUser.uid;

  const order: OrderType = await FindDocInCollection(
    userUID,
    "history",
    "id",
    props.id
  );

  if (!order) {
    dispatch(
      _notify({
        type: "ERROR",
        header: "Неудача",
        description: "Заказ не найден. Повторите попытку",
      })
    );
    return rejectWithValue("");
  }

  return order;
});

export const saveUserData = createAsyncThunk<
  CurrentUserData,
  CurrentUserData,
  { state: RootState }
>("user/saveUserData", async (props, { getState }) => {
  const userUID = getState().user.currentUser.uid;

  await UpdateProfileInfo(userUID, { userData: props });
  return props;
});

const _notify = createAsyncThunk<void, NotificationsType, { state: RootState }>(
  "user/notify",
  async (props, { dispatch }) => {
    dispatch(
      setNotification({
        type: props.type,
        header: props.header,
        description: props.description,
      })
    );

    setTimeout(() => dispatch(hideNotifications()), 3000);
  }
);

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

      .addCase(fetchUserFavorite.fulfilled, (state, action) => {
        state.currentUser.favorite = action.payload;
      })

      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.currentUser.addresses = action.payload;
      })

      .addCase(fetchUserBasket.fulfilled, (state, action) => {
        state.currentUser.basket = { ...action.payload };
      })

      .addCase(fetchUserHistory.fulfilled, (state, action) => {
        state.currentUser.history = action.payload.history;
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

      .addCase(setCurrentAddress.fulfilled, (state, action) => {
        state.currentUser.currentAddress = action.payload;
        state.isLoading = false;
      })

      .addCase(createOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentUser.basket = initialState.currentUser.basket;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(handleOrderStatus.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(handleOrderStatus.fulfilled, (state, action) => {
        state.currentUser.history.forEach((order) => {
          if (order.id === action.payload.id)
            order.status = action.payload.status;
        });

        state.isLoading = false;
      })

      .addCase(fetchOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentUser.openedOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(saveUserData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        state.currentUser.userData = action.payload;
        state.isLoading = false;
      });
  },
});

export default userSlice;
