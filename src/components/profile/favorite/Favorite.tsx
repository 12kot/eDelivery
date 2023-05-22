import React, { ReactElement } from "react";
import styles from "./Favorite.module.css";
import ProductItem from "components/main/products/productItem/ProductItem";
import { ProductType } from "types/types";
import { v4 } from "uuid";

type Props = {
  products: ProductType[];
};

const Favorite = (props: Props): ReactElement => {
  const getProducts = (): ReactElement[] => {
    if (props.products.length === 0) return [<h3>Продукты не добавлены</h3>];

    return props.products.map((product) => <ProductItem {...product} key={v4()} />);
  };

  return (
    <div className={styles.container}>
      <h2>Избранное</h2>
      <div className={styles.products}>{getProducts()}</div>
    </div>
  );
};

export default Favorite;
