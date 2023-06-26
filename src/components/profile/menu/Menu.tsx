import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Menu.module.css";

type Props = {
  userEmail: string;
  userName: string;
};

const Menu = (props: Props): ReactElement => {
  return (
    <div className={styles.menu}>
      <div className={styles.mail_container}>
        <div className={styles.mail_content}>
          <h5>Здравствуйте</h5>
          <h5>{props.userName ? props.userName : props.userEmail}</h5>
        </div>
      </div>
      <NavLink to="/profile" className={styles.menu_item}>
        <p>Профиль</p>
      </NavLink>
      <NavLink to="/profile/favorite" className={styles.menu_item}>
        <p>Избранное</p>
      </NavLink>
      <NavLink to="/basket" className={styles.menu_item}>
        <p>Корзина</p>
      </NavLink>
      <NavLink to="/profile/history" className={styles.menu_item}>
        <p>История заказов</p>
      </NavLink>
    </div>
  );
};

export default Menu;
