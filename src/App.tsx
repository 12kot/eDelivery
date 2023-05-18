import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
import Product from "components/product/Product";
import Category from "components/category/Category";
import Search from "components/search/Search";
import Login from "components/auth/login/Login";

const App = () => {
  return (
    <div>
      <Header />

      <div className="content">
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/category/:category" element={<Category />} />
          <Route path="/search/:request" element={<Search />} />
          <Route path="/category/:category/:id" element={<Product />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
