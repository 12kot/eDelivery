import React, { ReactElement } from "react";
import styles from "./BasketButtons.module.css";
import { ProductType } from "types/types";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  handleBasketProduct,
  handleFavoriteProduct,
} from "store/slices/userSlice";

type Props = {
  product: ProductType;
  favorite: boolean;
};

const BasketButtons = (props: Props): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn: boolean = !!useAppSelector(
    (state) => state.user.currentUser.email
  );
  const { favorite, basket } = useAppSelector(
    (state) => state.user.currentUser
  );
  const isLoading = useAppSelector((state) => state.user.isLoading);
  let count = 0;

  const isFavorite = (): boolean => {
    for (let product of favorite)
      if (product.id === props.product.id) return true;

    return false;
  };

  const handleFavorite = (): void => {
    if (isLoggedIn) dispatch(handleFavoriteProduct({ product: props.product }));
    else navigate("/login");
  };

  const inBasket = (): boolean => {
    for (let product of basket)
      if (product.product.id === props.product.id) {
        count = product.count;
        return true;
      }

    return false;
  };

  const handleAddProduct = (): void => {
    if (isLoggedIn)
      dispatch(
        handleBasketProduct({
          basketItem: { product: props.product, count: ++count },
        })
      );
    else navigate("/login");
  };

  const handleMinusProduct = (): void => {
    if (isLoggedIn)
      dispatch(
        handleBasketProduct({
          basketItem: { product: props.product, count: --count },
        })
      );
    else navigate("/login");
  };

  return (
    <div className={styles.buttons}>
      {inBasket() ? (
        <span className={styles.buttons_basket}>
          <button
            className={`${styles.button} ${styles.inBasket}`}
            onClick={handleMinusProduct}
          >
            -
          </button>
          <p className={styles.basket_count}>{`${count}`}</p>
          <button
            className={`${styles.button} ${styles.inBasket}`}
            onClick={handleAddProduct}
          >
            +
          </button>
        </span>
      ) : (
        <button
          className={`${styles.button} ${styles.inBasket}`}
          onClick={handleAddProduct}
        >
          +
        </button>
      )}
      {props.favorite ? (
        <button
          onClick={isLoading ? () => {} : handleFavorite}
          className={
            isFavorite()
              ? `${styles.isFavorite} ${styles.button}`
              : `${styles.button}`
          }
        >
          {isLoading ? "..." : "<3"}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BasketButtons;
