import React, { ReactElement } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banners";
import Categories from "./categories/Categories";
import Products from "./products/Products";
import { useAppSelector } from "hooks/hooks";

const Main = (): ReactElement => {
  const products = useAppSelector((state) => state.app.products);

  return (
    <div className={styles.container}>
      <Categories />
      <Banner />
      <Products heading="Рекомендуем" products={products}/>
    </div>
  );
};

export default Main;
