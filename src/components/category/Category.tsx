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

type MyParams = {
  category: string;
};

const Category = (): ReactElement => {
  const { category } = useParams<keyof MyParams>() as MyParams;
  const [numberOfProducts, setNumberOfProducts] = useState(3);
  const { products, currentCategory, totalNumberOfItems } =
    useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let equalKey = "category", equalValue: string | boolean = category;
    
    if (category === "discounts") {
      equalKey = "isDiscount";
      equalValue = true;
    }
    
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
    dispatch(fetchCategoryData({ category: category }));
  }, [category, numberOfProducts, dispatch]);

  const getProducts = (): ReactElement[] => {
    if (products.products) {
      return products.products.map((product) => (
        <ProductItem product={product} key={v4()} />
      ));
    }
    return [];
  };

  return (
    <div>
      {currentCategory ? (
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
      ) : <></>}
    </div>
  );
};

export default Category;
