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

const App = () => {
  const userEmail = useAppSelector((state) => state.user.currentUser.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user: AuthUser = JSON.parse(localStorage.getItem("user") as string);
    if (user) {
      dispatch(fetchUserData({ user: user }));
    }
  }, [dispatch]);

  return (
    <div>
      <Header />

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
            path="/profile"
            element={
              <Protected isLoggedIn={!!userEmail} path="/login">
                <Profile />
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
