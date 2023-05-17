import React, { ReactElement, Dispatch, SetStateAction } from "react";
import { ProductType } from "types/types";
import styles from "./Product.module.css";
import { useNavigate } from "react-router-dom";

type Props = {
  product: ProductType;
  setActive: Dispatch<SetStateAction<boolean>>;
};

const Product = (props: Props): ReactElement => {
  const navigate = useNavigate();

  const handleClick = () => {
    props.setActive(false);
    navigate(`category/${props.product.category}/${props.product.id}`);
  }

  return (
    <div className={styles.container}>
      <div onClick={handleClick}
        className={styles.nav_container}
      >
        <img src={props.product.imageURL} alt={props.product.name} />
        <div className={styles.description}>
          <p>{props.product.name}</p>
          <h5>{props.product.price}</h5>
        </div>
      </div>
        <div className={styles.add_button}>
          <button className={styles.button}>В корзину</button>
        </div>
    </div>
  );
};

export default Product;
