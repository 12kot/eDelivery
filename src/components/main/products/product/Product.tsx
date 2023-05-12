import React, { ReactElement } from "react";
import styles from "./Product.module.css";
import { ProductType } from "types/types";
import { NavLink } from "react-router-dom";

const Product = (props: ProductType): ReactElement => {
  return (
    <NavLink to={`/product/${props.id}`} className={styles.container}>
      <img src={props.imageURL} alt={props.name} />
      <div className={styles.content}>
        <h4>{props.price} р.</h4>

        <p className={styles.description}>{props.description}</p>
        <p className={styles.location}>{props.location}</p>
      </div>
      <button className={styles.button}>+</button>
    </NavLink>
  );
};

export default Product;