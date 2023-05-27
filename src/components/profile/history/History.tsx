import React, { ReactElement } from "react";
import styles from "./History.module.css";

const History = (): ReactElement => {
  return (
    <div className={styles.container}>
      <h2>История заказов</h2>
    </div>
  );
};

export default History;
