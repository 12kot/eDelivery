import React, { ReactElement } from "react";
import styles from "./ProductItem.module.css";
import { ProductType } from "types/types";
import { NavLink } from "react-router-dom";

const ProductItem = (props: ProductType): ReactElement => {
  return (
    <div className={styles.container}>
      <NavLink to={`/category/${props.category}/${props.id}`}>
        <div className={styles.image}><img src={props.imageURL} alt={props.name} /></div>
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
      <button className={styles.button}>+</button>
    </div>
  );
};

export default ProductItem;
