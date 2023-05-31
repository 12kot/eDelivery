import React, { ReactElement, useEffect } from "react";
import styles from "./History.module.css";
import HistoryItem from "./historyItem/HistoryItem";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { v4 } from "uuid";
import { fetchUserHistory } from "store/slices/userSlice";
import Loader from "ui/loader/Loader";

const History = (): ReactElement => {
  const history = useAppSelector((state) => state.user.currentUser.history);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserHistory());
  }, [dispatch]);

  const getHistory = (): ReactElement[] => {
    return history.map((order) => <HistoryItem order={order} key={v4()} />);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loader /> : <></>}
      <h2>История заказов</h2>
      <div className={styles.orders}>{getHistory()}</div>
    </div>
  );
};

export default History;
