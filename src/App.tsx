import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
import Product from "components/product/Product";

const App = () => {
  return (
    <div>
      <Header />

      <div className="content">
        <Routes>
          <Route path="/*" element={<Main />} />
          
          {/* <Route path="/category/:category" element={<Product />} /> */}
          <Route path="/category/:category/:id" element={<Product />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
