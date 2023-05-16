import React, { ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Head.module.css";
import Actions from "../actions/Actions";
import getSearchItems from "API/realtimeDB/getSearchItems";

const Head = (): ReactElement => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={`${styles.logo}`}>
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
            // onChange={async (e) => await getSearchItems("", "", e.target.value)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className={searchValue !== "" ? `${styles.search_button} ${styles.active}`: styles.search_button}><button className={styles.btn}>Найти</button></div>
        <div className={`${styles.container_actions}`}>
          <Actions isFooter={false} />
        </div>
      </div>
    </header>
  );
};

export default Head;
