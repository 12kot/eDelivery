import React, { ReactElement, Dispatch, SetStateAction } from "react";
import { ProductType } from "types/types";
import styles from "./Product.module.css";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import ProductActionsButtons from "components/commonObjects/productActionsButtons/ProductActionsButtons";

type Props = {
  product: ProductType;
  setActive: Dispatch<SetStateAction<boolean>>;
};

const Product = (props: Props): ReactElement => {
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleClick = () => {
    props.setActive(false);
    navigate(`category/${props.product.category}/${props.product.id}`);
  };

  return (
    <div ref={ref} className={styles.container}>
      <div onClick={handleClick} className={styles.nav_container}>
        {inView ? (
          <img src={props.product.imageURL} alt={props.product.name} />
        ) : (
          <img src="" alt=""></img>
        )}
        <div className={styles.description}>
          <p>{props.product.name}</p>
          <h5>{props.product.price}</h5>
        </div>
      </div>
      <div className={styles.add_button}>
        <ProductActionsButtons product={props.product} favorite={false} />
      </div>
    </div>
  );
};

export default Product;
