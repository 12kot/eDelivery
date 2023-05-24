import {  useAppSelector } from "hooks/hooks";
import React, { ReactElement } from "react";
import styles from "./Profile.module.css";
import Menu from "./menu/Menu";
import { Outlet } from "react-router-dom";

const Profile = (): ReactElement => {
  const user = useAppSelector((state) => state.user.currentUser);

  return (
    <div className={styles.container}>
      <Menu userEmail={user.email} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
