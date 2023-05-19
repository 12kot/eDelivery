import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CreateWithEmailAndPassword from "API/auth/CreateWithEmail";
import LoginByEmail from "API/auth/LoginByEmail";
import LoginByGoogle from "API/auth/LoginByGoogle";
import { CurrentUser } from "types/types";

type UserSlice = {
  currentUser: CurrentUser;
  isLoading: boolean;
};

const initialState: UserSlice = {
  currentUser: {
    email: "",
    uid: "",
    token: "",
    address: "",
    basket: "",
    favorite: "",
  },
  isLoading: false,
};

type db = {
  address: string;
  basket: string;
  favorite: string;
};

const dbUser: db = {
  address: "",
  basket: "",
  favorite: "",
}; //поулчаю инфу сюда из БД
//ПЕРЕИМЕНОВАТЬ

export const loginUserByGoogle = createAsyncThunk<void>(
  "user/loginUserByGoogle",
  async function (_, { dispatch }) {
    dispatch(setIsLoading(true));

    let data = await LoginByGoogle();
    if (data.email) {
      dispatch(setUser({ ...data, ...dbUser }));
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
    dispatch(setUser({...data, ...dbUser}));
  }

    console.log(data);
  dispatch(setIsLoading(false));
});

export const createUserWithEmail = createAsyncThunk<
  void,
  { email: string; password: string; repeatPassword: string }
>("user/createUserWithEmail", async function (props, { dispatch }) {
  dispatch(setIsLoading(true));
  //ВАЛИДАЦИЯ. СОЗДАТЬ ЯЧЕЙКУ В БД
  let data = await CreateWithEmailAndPassword(props.email, props.password);
  if (data.email) {
    dispatch(setUser({ ...data, address: "", basket: "", favorite: "" }));
  }

  dispatch(setIsLoading(false));
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CurrentUser>) {
      state.currentUser = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

const { setUser, setIsLoading } = userSlice.actions;
export default userSlice;
