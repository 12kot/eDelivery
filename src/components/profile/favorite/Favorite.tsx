import React, { ReactElement, useEffect } from "react";
import styles from "./Favorite.module.css";
import ProductItem from "components/main/products/productItem/ProductItem";
import { CurrentUser } from "types/types";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchUserFavorite } from "store/slices/userSlice";
import Loader from "ui/loader/Loader";
import { useOutletContext } from "react-router-dom";

const Favorite = (): ReactElement => {
  const user: CurrentUser = useOutletContext();

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(fetchUserFavorite());
  }, [dispatch]);

  const getProducts = (): ReactElement[] => {
    if (user.favorite.length === 0) return [<h3 key={v4()}>Продукты не добавлены</h3>];

    return user.favorite.map((product) => (
      <ProductItem {...product} key={v4()} />
    ));
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2>Избранное</h2>
          <div className={styles.products}>{getProducts()}</div>
        </>
      )}
    </div>
  );
};

export default Favorite;
