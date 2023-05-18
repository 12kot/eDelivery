import React, { ReactElement } from "react";
import styles from "./Login.module.css";
import Input from "ui/input/Input";
import { NavLink } from "react-router-dom";

const Login = (): ReactElement => {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img
          src={
            "https://api.static.edostavka.by/media/63e3b647eba50_379x468.jpg?id=12826"
          }
          alt="banner"
        ></img>
      </div>
      <div className={styles.login_form}>
        <div className={styles.login_form_cont}>
          <h2 className={styles.item}>Вход на eDelivery</h2>
          <Input name="Введите логин" />
          <Input name="Введите пароль" />
          <button className={`${styles.forgot_pass} ${styles.text_button}`}>
            Забыли пароль?
          </button>
          <button className={styles.login_button}>Войти в аккаунт</button>

          <div className={styles.line_container}>
            <p>
              <span>ИЛИ</span>
            </p>
          </div>

          <div className={styles.login_google}>GOOGLE</div>
          <div className={styles.new_user}>
            Новый пользователь?{" "}
            <NavLink to="/register" className={styles.text_button}>
              Создать учётную запись
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
