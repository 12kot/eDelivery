import React, { ReactElement } from "react";
import styles from "./ProfileContent.module.css";
import { CurrentUser } from "types/types";
import UserData from "./userData/UserData";
import Addresses from "./adresses/Addresses";
import { logoutUser } from "store/slices/userSlice";
import { useAppDispatch } from "hooks/hooks";
import Line from "ui/line/Line";
import { useOutletContext } from "react-router-dom";

const ProfileContent = (): ReactElement => {
  const user: CurrentUser = useOutletContext()

  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(logoutUser());
  };

  return (
    <div className={styles.container}>
      <h2>Профиль</h2>
      <span className={styles.uid}>
        <p>Ваш ID клиента: {user.uid}</p>
      </span>
      <UserData user={user} />
      <Addresses />

      <span className={styles.line}>
        <Line text="УПРАВЛЕНИЕ" />
      </span>
      <span className={styles.logout}>
        <button onClick={handleClick}>
          Выйти из аккаунта
        </button>
      </span>
    </div>
  );
};

export default ProfileContent;
