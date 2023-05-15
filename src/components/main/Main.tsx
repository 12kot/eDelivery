import React, { ReactElement, useEffect } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banners";
import Categories from "./categories/Categories";
import ProductsSwiper from "./products/ProductsSwiper";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchData } from "store/slices/appSlice";
import Loader from "ui/loader/Loader";
import { ProductType } from "types/types";

const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const {products, isLoading} = useAppSelector((state) => state.app);

  useEffect(() => {
    dispatch(fetchData({path: "categories", type: "SET_CATEGORIES"}));
    dispatch(fetchData({path: "products/products", type: "SET_ALL_PRODUCTS"}));
  }, [dispatch]);

  const getDiscountProducs = (): ProductType[] => {
    return products.products.filter((product) => product.isDiscount);
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Categories />
          <Banner />
          <ProductsSwiper heading="Рекомендуем" products={products.products} />
          <ProductsSwiper heading="Низкие цены!" products={getDiscountProducs()} />
        </>
      )}
    </div>
  );
};

export default Main;
