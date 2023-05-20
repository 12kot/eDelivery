import React, { ReactElement } from "react";
import styles from "./UserData.module.css";
import { CurrentUser } from "types/types";

type Props = {
  user: CurrentUser;
};

const UserData = (props: Props): ReactElement => {
  return (
    <div className={styles.personal_data}>
      <span className={styles.header}>
        <h3>Личные данные</h3>
        <p>Редактировать</p>
      </span>
      <div className={styles.info}>
        <div className={styles.data_block}>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Фамилия</p>
            <p className={styles.data_data}>Фамилия</p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Имя</p>
            <p className={styles.data_data}>Имя</p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Отчество</p>
            <p className={styles.data_data}>Отчество</p>
          </span>
        </div>
        <div className={styles.data_block}>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Email</p>
            <p className={styles.data_data}>{props.user.email}</p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Телефон</p>
            <p className={styles.data_data}>+ --- -- -- ---</p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Пол</p>
            <p className={styles.data_data}>Ламинат</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserData;
