import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Search.module.css";
import { NavLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  fetchNumberOfSearchItems,
  fetchSearchItems,
} from "store/slices/appSlice";
import ProductItem from "components/main/products/productItem/ProductItem";
import { v4 } from "uuid";

type MyParams = {
  request: string;
};

const Search = (): ReactElement => {
  const { request } = useParams<keyof MyParams>() as MyParams;
  const [numberOfProducts, setNumberOfProducts] = useState(3);
  const { totalNumberOfItems, products } = useAppSelector(
    (state) => state.app.products.search
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNumberOfSearchItems({ equalKey: "name", equalValue: request }));
    dispatch(fetchSearchItems({ equalKey: "name", equalValue: request, count: numberOfProducts }));
  }, [request, numberOfProducts, dispatch]);

  const getProducts = (): ReactElement[] => {
    return products.map((product) => <ProductItem product={product} key={v4()} />);
  };

  return (
    <div className={styles.container}>
      <NavLink to="/" className={styles.back_home}>
        <p>{`<---`} Вернуться на главную</p>
      </NavLink>
      <h2>{`Поиск товаров по запросу: "${request}" найдено ${totalNumberOfItems}`}</h2>
      <div className={styles.products}>{getProducts()}</div>

      <div className={styles.add_button}>
        {numberOfProducts < totalNumberOfItems ? (
          <button onClick={() => setNumberOfProducts(numberOfProducts + 3)}>
            Загрузить ещё
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Search;
