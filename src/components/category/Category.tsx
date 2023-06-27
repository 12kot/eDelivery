import React, { ReactElement, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./Category.module.css";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  fetchCategoryData,
  fetchCollectionProductsData,
  fetchNumberOfItems,
} from "store/slices/appSlice";
import ProductItem from "components/main/products/productItem/ProductItem";
import { v4 } from "uuid";
import Loader from "ui/loader/Loader";
import NotFound from "components/product/notFoundPage/NotFound";

type MyParams = {
  category: string;
};

const Category = (): ReactElement => {
  const { category } = useParams<keyof MyParams>() as MyParams;
  const [numberOfProducts, setNumberOfProducts] = useState(3);
  const { products, currentCategory, totalNumberOfItems, isLoading } =
    useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let equalKey = "category",
      equalValue: string | boolean = category;

    if (category === "discounts") {
      equalKey = "isDiscount";
      equalValue = true;
    }

    dispatch(fetchCategoryData({ category: category }));
    dispatch(
      fetchCollectionProductsData({
        equalKey: equalKey,
        equalValue: equalValue,
        count: numberOfProducts,
      })
    );
    dispatch(
      fetchNumberOfItems({ equalKey: equalKey, equalValue: equalValue })
    );
  }, [category, numberOfProducts, dispatch]);

  const getProducts = (): ReactElement[] => {
    debugger
    if (products.products) {
      return products.products.map((product) => (
        <ProductItem product={product} key={v4()} />
      ));
    }
    return [];
  };

  return (
    <div>
      {isLoading ? <Loader /> : <></>}
      {currentCategory?.category ? (
        <div className={styles.container}>
          <NavLink to="/" className={styles.back_home}>
            <p>{`<---`} Вернуться назад</p>
          </NavLink>
          <h2>{currentCategory.category}</h2>
          <div className={styles.products}>{getProducts()}</div>

          <div className={styles.add_button}>
            {getProducts().length !== 0 ? (
              numberOfProducts < totalNumberOfItems ? (
                <button
                  onClick={() => setNumberOfProducts(numberOfProducts + 3)}
                >
                  Загрузить ещё
                </button>
              ) : (
                <h4>Это конец</h4>
              )
            ) : (
              <h4>Продукты отсутствуют</h4>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <NotFound />
        </div>
      )}
    </div>
  );
};

export default Category;
