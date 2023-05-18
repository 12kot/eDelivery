import React, { ReactElement, useEffect } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banners";
import Categories from "./categories/Categories";
import ProductsSwiper from "./products/ProductsSwiper";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchCollectionProductsData, fetchCollectionCategoriesData } from "store/slices/appSlice";
import Loader from "ui/loader/Loader";
import { ProductType } from "types/types";

const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.app);

  useEffect(() => {
     dispatch(fetchCollectionCategoriesData());
     dispatch(fetchCollectionProductsData ({equalKey: "category", equalValue: null, count: 15}));
  }, [dispatch]);

  const getDiscountProducs = (): ProductType[] => {
      return products.products.filter((product: ProductType) => product.isDiscount);
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
