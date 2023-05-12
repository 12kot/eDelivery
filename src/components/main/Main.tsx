import React, { ReactElement } from "react";
import styles from "./Main.module.css";
import Banner from "./banner/Banner";
import Categories from "./categories/Categories";

const Main = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Categories />
      <Banner />
      <div className={styles.item}></div>
    </div>
  );
};

export default Main;
