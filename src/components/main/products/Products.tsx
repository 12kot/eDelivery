import React, { ReactElement } from "react";
import styles from "./Products.module.css";
import Product from "./product/Product";
import { ProductType } from "types/types";
import { v4 } from "uuid";

type Props = {
  heading: string;
  products: ProductType[];
};

const Products = (props: Props): ReactElement => {
  const getProducts = (): ReactElement[] => {
    return props.products.map((product) => <Product {...product} key={v4()} />);
  };

  return (
    <span className={styles.container}>
      <h3>{props.heading}</h3>
      <div className={styles.products}>{getProducts()}</div>
    </span>
  );
};

export default Products;
