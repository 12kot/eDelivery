import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Order.module.css";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchOrder, handleOrderStatus } from "store/slices/userSlice";
import Loader from "ui/loader/Loader";
import Product from "./product/Product";
import { v4 } from "uuid";
import Address from "components/profile/profile/adresses/address/Address";

const Order = (): ReactElement => {
  const { id } = useParams<keyof { id: number }>();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const openedOrder = useAppSelector(
    (state) => state.user.currentUser.openedOrder
  );
  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const uid: number = id ? +id : -1;
    dispatch(fetchOrder({ id: uid }));
  }, [dispatch, id, refresh]);

  const cancelOrder = async (): Promise<void> => {
    await dispatch(
      handleOrderStatus({ id: openedOrder.id, status: "CANCELED" })
    );
    setRefresh(!refresh);
  };

  const acceptOrder = async (): Promise<void> => {
    await dispatch(
      handleOrderStatus({ id: openedOrder.id, status: "ACCEPTED" })
    );
    setRefresh(!refresh);
  };

  const getItems = (): ReactElement[] | undefined => {
    return openedOrder?.products.map((product) => (
      <Product product={product} key={v4()} />
    ));
  };

  const getStatus = (): ReactElement => {
    if (openedOrder?.status === "WAITING")
      return (
        <>
          <button
            className={`${styles.cancelStatus} ${styles.status}`}
            onClick={cancelOrder}
          >{`Отменить`}</button>
          <button
            className={styles.status}
            onClick={acceptOrder}
          >{`Подтвердить`}</button>
        </>
      );

    if (openedOrder?.status === "ACCEPTED")
      return <button className={styles.status}>{`Доставлен`}</button>;

    return (
      <button
        className={`${styles.cancelStatus} ${styles.status}`}
      >{`Отменён`}</button>
    );
  };

  const getSale = (): number => {
    let totalPrice: number = 0;
    const orderPrice: number = openedOrder?.price ? openedOrder.price : 1;

    openedOrder?.products.forEach((product) => {
      totalPrice += product.count * product.price;
    });

    if (totalPrice === orderPrice) return 0;
    return Math.ceil(100 - (orderPrice * 100) / totalPrice);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loader /> : <></>}
      {openedOrder.id !== -1 ? (
        <>
          <h2>Заказ #{id}</h2>
          <p className={styles.date}>
            Дата оформления заказа: {openedOrder.date}
          </p>
          <span className={styles.statusItems}>{getStatus()}</span>
          <Address address={openedOrder.address} isOrder={true} />
          <span className={styles.statusItems}>
            <p className={`${styles.priceStatus} ${styles.status}`}>
              Общая сумма заказа: <strong>{openedOrder?.price}</strong>р.
            </p>
            <p className={`${styles.saleStatus} ${styles.status}`}>
              {" "}
              Скидка: {getSale()}%{" "}
            </p>
          </span>
          <div className={styles.products}>{getItems()}</div>{" "}
        </>
      ) : (
        <>Заказ не найден</>
      )}
    </div>
  );
};

export default Order;
