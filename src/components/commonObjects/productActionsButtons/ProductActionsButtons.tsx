import React, { ReactElement } from "react";
import styles from "./ProductActionsButtons.module.css";
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

const ProductActionsButtons = (props: Props): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn: boolean = !!useAppSelector(
    (state) => state.user.currentUser.email
  );
  const favoriteItems = useAppSelector(
    (state) => state.user.currentUser.favorite.items
  );
  const basketItems = useAppSelector(
    (state) => state.user.currentUser.basket.items
  );
  const isLoading = useAppSelector((state) => state.user.isLoading);
  let count = 0;

  const isFavorite = (): boolean => {
    for (let item of favoriteItems) if (item === props.product.id) return true;

    return false;
  };

  const handleFavorite = (): void => {
    if (isLoggedIn)
      dispatch(handleFavoriteProduct({ productID: props.product.id }));
    else navigate("/login");
  };

  const inBasket = (): boolean => {
    for (let item of basketItems)
      if (item.id === props.product.id) {
        count = item.count;
        return true;
      }

    return false;
  };

  const handleAddProduct = (): void => {
    if (isLoggedIn)
      dispatch(
        handleBasketProduct({
          basketItem: { id: props.product.id, count: ++count },
          type: "PLUS",
        })
      );
    else navigate("/login");
  };

  const handleMinusProduct = (): void => {
    if (isLoggedIn)
      dispatch(
        handleBasketProduct({
          basketItem: { id: props.product.id, count: --count },
          type: "MINUS",
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
      ) : props.product.quantity !== 0 ? (
        <button
          className={`${styles.button} ${styles.inBasket}`}
          onClick={handleAddProduct}
        >
          +
        </button>
      ) : (
        <button className={`${styles.button} ${styles.absent}`}>Няма</button>
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

export default ProductActionsButtons;
