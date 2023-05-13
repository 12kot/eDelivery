import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banners";
import Categories from "./categories/Categories";
import Products from "./products/Products";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { setCategories, setProductCategory } from "store/slices/appSlice";
import { CategoryType, ProductType } from "types/types";
import Loader from "ui/loader/Loader";
import getCategoryData from "API/realtimeDB/getCategoryData";

const Main = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.app.products);

  useEffect(() => {
    const get = async () => {
      const categories: CategoryType[] | undefined = await getCategoryData("categories");
      if (categories) dispatch(setCategories(categories));

      const data: ProductType[] | undefined = await getCategoryData("products/products");
      if (data) dispatch(setProductCategory(data));
      setIsLoading(false);
    };

    get();
  }, [dispatch]);

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
