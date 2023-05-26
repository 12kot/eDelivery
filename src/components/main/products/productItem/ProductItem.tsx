import React, { ReactElement } from "react";
import styles from "./ProductItem.module.css";
import { ProductType } from "types/types";
import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import ProductActionsButtons from "components/productActionsButtons/ProductActionsButtons";

type Props = {
  product: ProductType;
};

const ProductItem = (props: Props): ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={styles.container}>
      <NavLink to={`/category/${props.product.category}/${props.product.id}`}>
        <div className={styles.image}>
          {inView ? (
            <img src={props.product.imageURL} alt={props.product.name} />
          ) : (
            <img src="" alt=""></img>
          )}
        </div>
        <div
          className={
            props.product.isDiscount
              ? `${styles.content} ${styles.discount}`
              : `${styles.content}`
          }
        >
          <h4>{props.product.price} р.</h4>

          <p className={styles.description}>{props.product.name}</p>
          <p className={styles.location}>{props.product.location}</p>
        </div>
      </NavLink>

      <ProductActionsButtons product={props.product} favorite={true} />
    </div>
  );
};

export default ProductItem;
