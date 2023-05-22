import React, { ReactElement } from "react";
import styles from "./ProductItem.module.css";
import { ProductType } from "types/types";
import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { handleFavoriteProduct } from "store/slices/userSlice";

const ProductItem = (props: ProductType): ReactElement => {
  const favorite = useAppSelector(state => state.user.currentUser.favorite)
  const dispatch = useAppDispatch();

  const isFavorite = () => {
    for (let product of favorite)
      if (product.id === props.id)
        return true;
    
    return false;
  }

  const handleFavorite = () => {
    dispatch(handleFavoriteProduct({ product: props }));
  }

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
        <button onClick={handleFavorite} className={isFavorite() ? `${styles.isFavorite} ${styles.button}` : `${styles.button}`}>{"<3"}</button>
      </div>
    </div>
  );
};

export default ProductItem;
