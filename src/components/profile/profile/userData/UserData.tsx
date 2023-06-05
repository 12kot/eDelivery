import React, { ReactElement, useState } from "react";
import styles from "./UserData.module.css";
import { CurrentUserData } from "types/types";
import EditData from "./editData/EditData";

type Props = {
  userData: CurrentUserData;
  email: string;
};

const UserData = (props: Props): ReactElement => {
  const [isActive, setIsActive] = useState(false);

  const getGender = (): string => {
    if (props.userData.gender === "MALE") return "Мужской";
    if (props.userData.gender === "FEMALE") return "Женский";
    if (props.userData.gender === "LAMINAT") return "Ламинат";
    return "---";
  };
  
  return (
    <div className={styles.personal_data}>
      <span className={styles.header}>
        <h3>Личные данные</h3>
        <p
          onClick={() => {
            setIsActive(true);
          }}
        >
          Редактировать
        </p>
      </span>
      <div className={styles.info}>
        <div className={styles.data_block}>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Фамилия</p>
            <p className={styles.data_data}>
              {props.userData.lastName ? props.userData.lastName : "---"}
            </p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Имя</p>
            <p className={styles.data_data}>
              {props.userData.firstName ? props.userData.firstName : "---"}
            </p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Отчество</p>
            <p className={styles.data_data}>
              {props.userData.middleName ? props.userData.middleName : "---"}
            </p>
          </span>
        </div>
        <div className={styles.data_block}>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Email</p>
            <p className={styles.data_data}>{props.email}</p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Телефон</p>
            <p className={styles.data_data}>
              {props.userData.phoneNumber ? props.userData.phoneNumber : "---"}
            </p>
          </span>
          <span className={styles.data_item}>
            <p className={styles.data_head}>Пол</p>
            <p className={styles.data_data}>{getGender()}</p>
          </span>
        </div>
      </div>

      <EditData isActive={isActive} setIsActive={setIsActive} user={props} />
    </div>
  );
};

export default UserData;
