import React, { ReactElement } from "react";
import styles from "./Footer.module.css";
import Actions from "../actions/Actions";

const Footer = (): ReactElement => {
  return (
    <footer className={`${styles.footer}`}>
          <Actions isFooter={true} />
    </footer>
  );
};

export default Footer;
