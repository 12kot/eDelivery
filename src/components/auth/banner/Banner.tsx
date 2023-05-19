import React, { ReactElement } from "react";
import styles from "./Banner.module.css"

const Banner = (): ReactElement => {
  return (
    <div className={styles.banner}>
      <img
        src={
          "https://api.static.edostavka.by/media/63e3b647eba50_379x468.jpg?id=12826"
        }
        alt="banner"
      ></img>
    </div>
  );
};

export default Banner;
