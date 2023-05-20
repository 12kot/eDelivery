import {  useAppSelector } from "hooks/hooks";
import React, { ReactElement } from "react";
import styles from "./Profile.module.css";
import Menu from "./menu/Menu";
import ProfileContent from "./profile/ProfileContent";

const Profile = (): ReactElement => {
  const user = useAppSelector((state) => state.user.currentUser);

  return (
    <div className={styles.container}>
      <Menu userEmail={user.email} />
      <div className={styles.content}>
        <ProfileContent user={user} />
      </div>
    </div>
  );
};

export default Profile;
