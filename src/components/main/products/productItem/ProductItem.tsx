import React, { ReactElement } from "react";
import styles from "./ProductItem.module.css";
import { ProductType } from "types/types";
import { NavLink, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { handleFavoriteProduct } from "store/slices/userSlice";

const ProductItem = (props: ProductType): ReactElement => {
  const isLoggedIn: boolean = !!useAppSelector((state) => state.user.currentUser.email)
  const favorite = useAppSelector((state) => state.user.currentUser.favorite);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isFavorite = () => {
    for (let product of favorite) if (product.id === props.id) return true;

    return false;
  };

  const handleFavorite = () => {
    if (isLoggedIn)
      dispatch(handleFavoriteProduct({ product: props }));
    else navigate("/login");
  };

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={styles.container}>
      <NavLink to={`/category/${props.category}/${props.id}`}>
        <div className={styles.image}>
          {inView ? (
            <img src={props.imageURL} alt={props.name} />
          ) : (
            <img src="" alt=""></img>
          )}
        </div>
        <div
          className={
            props.isDiscount
              ? `${styles.content} ${styles.discount}`
              : `${styles.content}`
          }
        >
          <h4>{props.price} р.</h4>

          <p className={styles.description}>{props.name}</p>
          <p className={styles.location}>{props.location}</p>
        </div>
      </NavLink>

      <div className={styles.buttons}>
        <button className={styles.button}>+</button>
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
      </div>
    </div>
  );
};

export default ProductItem;
