import React, { ReactElement } from "react";
import styles from "./LoginButton.module.css";

type Props = {
  text: string;
  onClick: () => void
}

const LoginButton = (props: Props): ReactElement => {
  return <button className={styles.login_button} onClick={props.onClick}>{props.text}</button>;
};

export default LoginButton;
