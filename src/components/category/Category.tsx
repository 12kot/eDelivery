import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Category.module.css";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  fetchCategoryData,
  fetchCollectionProductsData,
} from "store/slices/appSlice";
import ProductsSwiper from "components/main/products/ProductsSwiper";
import Loader from "ui/loader/Loader";

const Category = (): ReactElement => {
  const { category } = useParams();
  const dispatch = useAppDispatch();
  const { products, isLoading, currentCategory } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (category) {
      dispatch(fetchCollectionProductsData({ category: category }));
      dispatch(fetchCategoryData({ category: category }));
    }
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : currentCategory ? (
        <>
          <ProductsSwiper
            heading={currentCategory.category}
            products={products.products}
          />
        </>
      ) : (
        <h1>Категория не найдена </h1>
      )}
    </div>
  );
};

export default Category;
