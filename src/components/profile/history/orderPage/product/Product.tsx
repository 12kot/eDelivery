import React, { ReactElement } from "react";
import styles from "./Product.module.css";
import { OrderProductType } from "types/types";

type Props = {
  product: OrderProductType;
};

const Product = (props: Props): ReactElement => {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={props.product.imageURL}
        alt={props.product.name}
      ></img>
      <span className={styles.description}>
        <strong>{props.product.name}</strong>
        <p>
          Общая стоимость: {props.product.price}р. x {props.product.count} ={" "}
          <strong>{props.product.count * props.product.price}</strong>р.
        </p>
      </span>
    </div>
  );
};

export default Product;
