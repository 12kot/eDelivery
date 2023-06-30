import React, { ReactElement, useEffect } from "react";
import styles from "./Notification.module.css";
import { useAppSelector } from "hooks/hooks";

const Notification = (): ReactElement => {
  const { header, description } = useAppSelector(
    (state) => state.notifications
  );

  const type = useAppSelector((state) => state.notifications.type);

  const getStyle = (): string => {
    switch (type) {
      case "ERROR":
        return styles.error;
      case "SUCCESS":
        return styles.success;
      default:
        return styles.disabled;
    }
  };

  return (
    <div
      className={`${styles.container} ${
        type ? styles.active : ""
      } ${getStyle()}`}
    >
      <header>
        <h4>{header}</h4>
      </header>

      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Notification;
