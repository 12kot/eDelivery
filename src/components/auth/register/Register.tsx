import React, { ReactElement, useState } from "react";
import styles from "./../Auth.module.css";
import Input from "ui/input/Input";
import { NavLink } from "react-router-dom";
import Banner from "../banner/Banner";
import GoogleSignInButton from "ui/buttons/googleButton/GoogleSignInButton";
import Line from "ui/line/Line";
import LoginButton from "ui/buttons/loginButton/LoginButton";
import { useAppDispatch } from "hooks/hooks";
import { createUserWithEmail, loginUserByGoogle } from "store/slices/userSlice";

const Register = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLoginByGoogle = (): void => {
    dispatch(loginUserByGoogle());
  };

  const handleRegister = (): void => {
    dispatch(
      createUserWithEmail({
        email: email,
        password: password,
        repeatPassword: repeatPassword,
      })
    );
  };

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.login_form}>
        <div className={styles.login_form_cont}>
          <h2 className={styles.item}>Регистрация на eDelivery</h2>
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
              value={password}
              onChange={setPassword}
              autocomplete="new-password"
            />
          </div>
          <div className={styles.input_item}>
            <Input
              name="Повторите пароль"
              type="password"
              value={repeatPassword}
              onChange={setRepeatPassword}
              autocomplete="new-password"
            />
          </div>
          <div className={styles.login_button}>
            <LoginButton text="Зарегистрироваться" onClick={handleRegister} />
          </div>

          <div className={styles.line}>
            <Line text="ИЛИ" />
          </div>

          <div className={styles.google_button}>
            <GoogleSignInButton onClick={handleLoginByGoogle} />
          </div>

          <div className={styles.new_user}>
            Уже зарегистрированы?{" "}
            <NavLink to="/login" className={styles.text_button}>
              Авторизоваться
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
