import React, { ReactElement } from "react";
import styles from "./HistoryItem.module.css";
import { NavLink } from "react-router-dom";
import { OrderType } from "types/types";
import { useAppDispatch } from "hooks/hooks";
import { handleOrderStatus } from "store/slices/userSlice";

type Props = {
  order: OrderType;
};

const HistoryItem = (props: Props): ReactElement => {
  const dispatch = useAppDispatch();

  const getProductsCount = (): number => {
    let count = 0;
    for (const product of props.order.products) count += product.count;
    return count;
  };

  const cancelOrder = (): void => {
    dispatch(handleOrderStatus({ id: props.order.id, status: "CANCELED" }));
  };

  const acceptOrder = (): void => {
    dispatch(handleOrderStatus({ id: props.order.id, status: "ACCEPTED" }));
  };

  const getStatus = (): ReactElement => {
    if (props.order.status === "WAITING")
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

    if (props.order.status === "ACCEPTED")
      return <button className={styles.status}>{`Доставлен`}</button>;

    return (
      <button
        className={`${styles.cancelStatus} ${styles.status}`}
      >{`Отменён`}</button>
    );
  };

  return (
    <div className={styles.container}>
      <NavLink to={`/profile/history/${props.order.id}`} className={styles.header}>
        <strong>{`Заказ #${props.order.id}`}</strong>
        <p className={styles.date}>{`${props.order.date}`}</p>
      </NavLink>
      <span className={styles.statusItems}>{getStatus()}</span>
      <span>{`${getProductsCount()} предметов на сумму ${
        props.order.price
      } р.`}</span>
    </div>
  );
};

export default HistoryItem;
