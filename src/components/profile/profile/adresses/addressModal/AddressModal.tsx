import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import styles from "./AddressModal.module.css";
import Input from "ui/input/Input";
import { useAppDispatch } from "hooks/hooks";
import { handleAddress } from "store/slices/userSlice";

type Props = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};

const AddAddressModal = (props: Props): ReactElement => {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [block, setBlock] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [flat, setFlat] = useState("");

  const dispatch = useAppDispatch();

  const handleAddAddress = (): void => {
    if (!city || !street || !houseNumber) {
      alert("Введены не все данные");
      return;
    }

    props.setIsActive(false);
    dispatch(
      handleAddress({city, street, houseNumber, block, entrance, floor, flat, id: ""})
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
          <h3>Добавить новый адрес</h3>
          <div className={styles.items}>
            <span className={styles.item}>
              <Input
                type="text"
                name="Населённый пункт"
                value={city}
                onChange={setCity}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Улица"
                value={street}
                onChange={setStreet}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Дом"
                value={houseNumber}
                onChange={setHouseNumber}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Корпус"
                value={block}
                onChange={setBlock}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Подъезд"
                value={entrance}
                onChange={setEntrance}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Этаж"
                value={floor}
                onChange={setFloor}
                autocomplete="off"
              />
            </span>
            <span className={styles.item}>
              <Input
                type="text"
                name="Квартира"
                value={flat}
                onChange={setFlat}
                autocomplete="off"
              />
            </span>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.close}
              onClick={() => {
                props.setIsActive(false);
              }}
            >
              Отмена
            </button>
            <button className={styles.addAddress} onClick={handleAddAddress}>
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
