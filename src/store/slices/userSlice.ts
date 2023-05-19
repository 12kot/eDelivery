import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CreateWithEmailAndPassword from "API/auth/CreateWithEmail";
import LoginByEmail from "API/auth/LoginByEmail";
import LoginByGoogle from "API/auth/LoginByGoogle";
import Logout from "API/auth/Logout";
import { AuthUser, CurrentUser } from "types/types";

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

export const fetchUserData = createAsyncThunk<void, { user: AuthUser }>(
  "user/fetchUserData",
  async function (props, { dispatch }) {
    //ВОТ ТУТ МНЕ НАДО ПОЛУЧИТЬ ИНФУ О ЮЗЕРЕ ИЗ БД
    dispatch(
      setCurrentUser({ ...props.user, address: "", basket: "", favorite: "" })
    );
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
  let data = await CreateWithEmailAndPassword(props.email, props.password);
  if (data.email) {
    dispatch(
      setCurrentUser({ ...data, address: "", basket: "", favorite: "" })
    );
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUser>) {
      state.currentUser = action.payload;
    },
    removeCurrentUser(state) {
      state.currentUser = initialState.currentUser;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

const { setCurrentUser, setIsLoading, removeCurrentUser } = userSlice.actions;
export default userSlice;
