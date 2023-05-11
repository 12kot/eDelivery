import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import styles from "./Actions.module.css";
import homeIcon from "images/icons/home.png";
import userIcon from "images/icons/user.png";
import compareIcon from "images/icons/compare.png";
import heartIcon from "images/icons/heart.png";
import basketIcon from "images/icons/basket.png";

type Props = {
  isFooter: boolean;
};

const Actions = (props: Props): ReactElement => {
  return (
    <div className={styles.container_actions}>
      {!props.isFooter ? (
        <></>
      ) : (
        <NavLink to="/"className={`${styles.action}`}>
            <img src={homeIcon} alt="main" />
            <p>Главная</p>
        </NavLink>
      )}
      <NavLink to="/profile" className={`${styles.action}`}>
          <img src={userIcon} alt="user" />
          <p>Войти</p>
        
      </NavLink>
      <NavLink to="/compare" className={`${styles.action}`}>
          <img src={compareIcon} alt="compare" />
          <p>Сравнение</p>
        
      </NavLink>
      <NavLink to="/heart" className={`${styles.action}`}>
          <img src={heartIcon} alt="heart" />
          <p>Избранное</p>
        
      </NavLink>
      <NavLink to="/basket" className={`${styles.action}`}>
          <img src={basketIcon} alt="basket" />
          <p>Корзина</p>
        
      </NavLink>
    </div>
  );
};

export default Actions;
