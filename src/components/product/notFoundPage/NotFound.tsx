import React, { ReactElement, useEffect } from "react";
import styles from "./NotFound.module.css";
import { NavLink } from "react-router-dom";
import ProductsSwiper from "components/main/products/ProductsSwiper";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchCollectionProductsData } from "store/slices/appSlice";

const NotFound = (): ReactElement => {
  const products = useAppSelector((state) => state.app.products.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (products.length === 0)
      dispatch(
        fetchCollectionProductsData({
          equalKey: "category",
          equalValue: null,
          count: 15,
        })
      );
  }, [dispatch, products]);

  return (
    <>
      <div className={styles.container}>
        <span className={styles.description}>
          <h2>Мы не нашли такой страницы</h2>
          <p>
            Возможно, этой страницы уже нет или она переехала по другому адресу,
            но вы можете поискать похожую
          </p>
          <span className={styles.buttons}>
            <NavLink className={styles.toHome} to="/">
              Вернуться на главную
            </NavLink>
            <NavLink className={styles.toProfile} to="/profile">
              В профиль
            </NavLink>
          </span>
        </span>
        <img
          className={styles.banner}
          src="https://edostavka.by/assets/images/errors/404.svg"
          alt="banner"
        ></img>
      </div>
      <ProductsSwiper products={products} heading={"Самое интересное"} />
    </>
  );
};

export default NotFound;
