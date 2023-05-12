import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main/Main";
import Header from "./components/header/Header";

const App = () => {
  return (
    <div>
      <Header />

      <div className="content">
        <Routes>
          <Route path="/*" element={<Main />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
