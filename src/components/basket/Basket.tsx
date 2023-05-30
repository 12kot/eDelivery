import ProductItem from "components/main/products/productItem/ProductItem";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import React, { ReactElement, useEffect, useState } from "react";
import { fetchUserBasket } from "store/slices/userSlice";
import { ProductType } from "types/types";
import { v4 } from "uuid";
import styles from "./Basket.module.css";
import Loader from "ui/loader/Loader";
import Address from "components/profile/profile/adresses/address/Address";
import { NavLink } from "react-router-dom";
import ModalChooseAddress from "./chooseAddress/ModalChooseAddress";

const Basket = (): ReactElement => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(
    (state) => state.user.currentUser.basket.products
  );
  const items = useAppSelector((state) => state.user.currentUser.basket.items);
  const address = useAppSelector(
    (state) => state.user.currentUser.currentAddress
  );
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(fetchUserBasket());
  }, [dispatch]);

  const getProducts = (): ReactElement[] => {
    return products.map((product: ProductType) => (
      <ProductItem product={product} key={v4()} />
    ));
  };

  const getPrice = (): number => {
    let n = 0;
    products.forEach((product) => {
      const count = items.filter((item) => item.id === product.id);
      n += product.price * count[0].count;
    });

    return n;
  };

  const handleChooseAddress = (): void => {
    setIsActive(true);
  }

  const handleCreateOrder = (): void => {};

  return (
    <>
      {isLoading ? <Loader /> : <></>}

      {products.length === 0 ? (
        <div className={styles.basketIsNull}>
          <h2>Козина пуста</h2>
          <NavLink to="/">Отправиться за покупками</NavLink>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.order_content}>
            <h2>Содержимое корзины</h2>
            <div className={styles.products}>{getProducts()}</div>
          </div>
          <div
            className={
              products.length !== 0
                ? `${styles.order_approve} ${styles.active}`
                : styles.order_approve
            }
          >
            <div className={styles.order_approve_content}>
              <h3>Подтверждение заказа</h3>
              <span onClick={handleChooseAddress}>
                <p>Адрес доставки:</p>
                {address.id ? (
                  <Address address={address} />
                ) : (
                  <p className={styles.address}>
                    Адрес не выбран. Нажмите, чтобы выбрать адрес
                  </p>
                )}
              </span>
              <span>
                <p className={styles.price}>
                  Общая стоимость: <strong>{getPrice().toFixed(2)}</strong>р.
                </p>
              </span>
              <button className={styles.button} onClick={handleCreateOrder}>
                Оформить заказ
              </button>
            </div>
          </div>
          <ModalChooseAddress isActive={isActive} setIsActive={setIsActive} />
        </div>
      )}
    </>
  );
};

export default Basket;
