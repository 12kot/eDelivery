import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Head.module.css";
import Actions from "../actions/Actions";

const Head = (): ReactElement => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={`${styles.logo} ${styles.item}`}>
          <h2>LOGO</h2>
        </NavLink>
        <div className={`${styles.container_catalog}`}>
          <button className={`${styles.catalog} ${styles.item}`}>
            <p>Каталог</p>
          </button>
          <input
            type="text"
            placeholder="Поиск товаров"
            className={`${styles.search} ${styles.item}`}
          />
        </div>
        <div className={`${styles.container_actions}`}>
          <Actions isFooter={false} />
        </div>
      </div>
    </header>
  );
};

export default Head;
