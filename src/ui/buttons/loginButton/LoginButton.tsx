import React, { ReactElement } from "react";
import styles from "./LoginButton.module.css";
import { useAppSelector } from "hooks/hooks";

type Props = {
  text: string;
  onClick: () => void;
};

const LoginButton = (props: Props): ReactElement => {
  const isLoading = useAppSelector((state) => state.user.isLoading);

  return (
    <button
      className={styles.login_button}
      onClick={isLoading ? () => {} : props.onClick}
    >
      {isLoading ? "Подтягиваем данные" : props.text}
    </button>
  );
};

export default LoginButton;
