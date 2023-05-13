import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banners";
import Categories from "./categories/Categories";
import Products from "./products/Products";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import getData from "API/realtimeDB/getCategoryData";
import { setProductCategory } from "store/slices/appSlice";
import { ProductType } from "types/types";
import Loader from "ui/loader/Loader";

const Main = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.app.products);

  useEffect(() => {
    const get = async () => {
      const data: ProductType[] | undefined = await getData("products");
      if (data) dispatch(setProductCategory(data));
      setIsLoading(false);
    };

    get();
  }, [dispatch]);

  console.log(isLoading);
  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Categories />
          <Banner />
          <Products heading="Рекомендуем" products={products.products} />
          <Products heading="Низкие цены!" products={products.milk} />
        </>
      )}
    </div>
  );
};

export default Main;
