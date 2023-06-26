import React, { ReactElement, useState } from "react";
import styles from "./../Auth.module.css";
import Input from "ui/input/Input";
import { NavLink } from "react-router-dom";
import Banner from "../banner/Banner";
import GoogleSignInButton from "ui/buttons/googleButton/GoogleSignInButton";
import Line from "ui/line/Line";
import LoginButton from "ui/buttons/loginButton/LoginButton";
import { useAppDispatch } from "hooks/hooks";
import { loginUserByEmail, loginUserByGoogle } from "store/slices/userSlice";

const Login = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLoginByGoogle = () => {
    dispatch(loginUserByGoogle());
  };

  const handleLogin = (): void => {
    dispatch(
      loginUserByEmail({
        email: email,
        password: password,
      })
    );
  };

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.login_form}>
        <div className={styles.login_form_cont}>
          <h2 className={styles.item}>Вход на eDelivery</h2>
          <div className={styles.input_item}>
            <Input
              name="Введите логин"
              type="email"
              value={email}
              onChange={setEmail}
              autocomplete="username"
            />
          </div>
          <div className={styles.input_item}>
            <Input
              name="Введите пароль"
              type="password"
              value={password.trim()}
              onChange={setPassword}
              autocomplete="current-password"
            />
          </div>
          <button className={`${styles.forgot_pass} ${styles.text_button}`}>
            Забыли пароль?
          </button>

          <div className={styles.login_button}>
            <LoginButton text="Войти в аккаунт" onClick={handleLogin} />
          </div>

          <div className={styles.line}>
            <Line text="ИЛИ" />
          </div>

          <div className={styles.google_button}>
            <GoogleSignInButton onClick={handleLoginByGoogle} />
          </div>

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
