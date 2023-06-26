import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import styles from "components/commonObjects/modalStyles/ModalStyles.module.css";
import { CurrentUserData } from "types/types";
import Input from "ui/input/Input";
import { useAppDispatch } from "hooks/hooks";
import { saveUserData } from "store/slices/userSlice";

import { PhoneInput, usePhoneValidation } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "ui/select/Select";

type Props = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  user: { userData: CurrentUserData; email: string };
};

const EditData = (props: Props): ReactElement => {
  const [firstName, setFirstName] = useState(props.user.userData.firstName);
  const [lastName, setLastName] = useState(props.user.userData.lastName);
  const [middleName, setMiddleName] = useState(props.user.userData.middleName);
  const [phoneNumber, setPhoneNumber] = useState(
    props.user.userData.phoneNumber
  );
  const [gender, setGender] = useState(props.user.userData.gender);
  const dispatch = useAppDispatch();
  const phoneValidation = usePhoneValidation(phoneNumber);

  const handleSaveData = (): void => {
    props.setIsActive(false);
    dispatch(
      saveUserData({
        firstName,
        lastName,
        middleName,
        phoneNumber: phoneValidation.isValid
          ? phoneNumber
          : props.user.userData.phoneNumber,
        gender,
      })
    );
  };

  return (
    <div
      className={
        props.isActive ? `${styles.modal} ${styles.active}` : styles.modal
      }
      onClick={() => {
        props.setIsActive(false);
      }}
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h3>Изменение контактной информации</h3>
          <span className={styles.item}>
            <Input
              type="email"
              name="email"
              value={props.user.email}
              onChange={() => {}}
              autocomplete="off"
              readonly={true}
            />
          </span>
          <span className={styles.items}>
            <Input
              type="fname"
              name="Имя"
              value={firstName}
              onChange={setFirstName}
              autocomplete="off"
            />
            <Input
              type="lmane"
              name="Фамилия"
              value={lastName}
              onChange={setLastName}
              autocomplete="off"
            />
          </span>
          <span className={styles.items}>
            <Input
              type="mname"
              name="Отчество"
              value={middleName}
              onChange={setMiddleName}
              autocomplete="off"
            />
            <Select
              options={[
                { key: "MALE", value: "Мужской" },
                { key: "Female", value: "Женский" },
                { key: "LAMINAT", value: "Ламинат" },
              ]}
              onChange={setGender as Dispatch<SetStateAction<string>>}
              value={gender}
            />
          </span>
          <span className={styles.item}>
            <PhoneInput
              defaultCountry="by"
              value={phoneNumber}
              onChange={setPhoneNumber}
              style={{
                border: "2px #b1aeae solid",
                borderRadius: "5px",
              }}
              inputStyle={{ width: "100%", fontSize: "0.9rem" }}
            />
          </span>

          <div className={styles.buttons}>
            <button
              className={styles.close}
              onClick={() => {
                props.setIsActive(false);
              }}
            >
              Отмена
            </button>
            <button className={styles.addAddress} onClick={handleSaveData}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditData;
