import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
import Product from "components/product/Product";
import Category from "components/category/Category";
import Search from "components/search/Search";
import Login from "components/auth/login/Login";
import Register from "components/auth/register/Register";
import Protected from "functions/Protected";
import Profile from "components/profile/Profile";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { AuthUser } from "types/types";
import { fetchUserData } from "store/slices/userSlice";
import ProfileContent from "components/profile/profile/ProfileContent";
import Favorite from "components/profile/favorite/Favorite";
import Basket from "components/basket/Basket";
import History from "components/profile/history/History";
import Order from "components/profile/history/orderPage/Order";
import Notification from "components/notification/Notification";

const App = () => {
  const userEmail = useAppSelector((state) => state.user.currentUser.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user: AuthUser = JSON.parse(localStorage.getItem("user") as string);
    if (user) {
      dispatch(fetchUserData(user));
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Notification />

      <div className="content">
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route
            path="/login"
            element={
              <Protected isLoggedIn={!userEmail} path="/profile">
                <Login />
              </Protected>
            }
          />
          <Route
            path="/register"
            element={
              <Protected isLoggedIn={!userEmail} path="/profile">
                <Register />
              </Protected>
            }
          />

          <Route
            path="/profile/"
            element={
              <Protected isLoggedIn={!!userEmail} path="/login">
                <Profile />
              </Protected>
            }
          >
            <Route path="" element={<ProfileContent />} />
            <Route path="favorite" element={<Favorite />} />
            <Route path="history" element={<History />} />
            <Route path="history/:id" element={<Order />} />
          </Route>

          <Route
            path="/basket"
            element={
              <Protected isLoggedIn={!!userEmail} path="/login">
                <Basket />
              </Protected>
            }
          />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/search/:request" element={<Search />} />
          <Route path="/category/:category/:id" element={<Product />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
