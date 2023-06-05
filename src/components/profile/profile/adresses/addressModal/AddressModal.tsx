import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import styles from "components/commonObjects/modalStyles/ModalStyles.module.css";
import Input from "ui/input/Input";
import { useAppDispatch } from "hooks/hooks";
import { handleAddress } from "store/slices/userSlice";
import { AddressType } from "types/types";

type Props = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  header: string;
  address?: AddressType;
};

const AddressModal = (props: Props): ReactElement => {
  const address: AddressType = props.address
    ? props.address
    : {
        city: "",
        street: "",
        houseNumber: "",
        block: "",
        entrance: "",
        floor: "",
        flat: "",
        id: "",
      };

  const [city, setCity] = useState(address.city);
  const [street, setStreet] = useState(address.street);
  const [houseNumber, setHouseNumber] = useState(address.houseNumber);
  const [block, setBlock] = useState(address.block);
  const [entrance, setEntrance] = useState(address.entrance);
  const [floor, setFloor] = useState(address.floor);
  const [flat, setFlat] = useState(address.flat);

  const dispatch = useAppDispatch();

  const _clearAddress = () => {
    setCity("");
    setStreet("");
    setHouseNumber("");
    setBlock("");
    setEntrance("");
    setFloor("");
    setFlat("");
  };

  const handleAddAddress = (): void => {
    props.setIsActive(false);
    dispatch(
      handleAddress({
        city,
        street,
        houseNumber,
        block,
        entrance,
        floor,
        flat,
        id: address.id,
      })
    );

    _clearAddress();
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
          <h3>{props.header}</h3>
          <span className={styles.items}>
            <Input
              type="text"
              name="Населённый пункт"
              value={city}
              onChange={setCity}
              autocomplete="off"
            />
          </span>
          <span className={styles.items}>
            <Input
              type="text"
              name="Улица"
              value={street}
              onChange={setStreet}
              autocomplete="off"
            />
            <Input
              type="text"
              name="Дом"
              value={houseNumber}
              onChange={setHouseNumber}
              autocomplete="off"
            />
          </span>
          <span className={styles.items}>
            <Input
              type="text"
              name="Корпус"
              value={block}
              onChange={setBlock}
              autocomplete="off"
            />
            <Input
              type="text"
              name="Подъезд"
              value={entrance}
              onChange={setEntrance}
              autocomplete="off"
            />
          </span>
          <span className={styles.items}>
            <Input
              type="text"
              name="Этаж"
              value={floor}
              onChange={setFloor}
              autocomplete="off"
            />
            <Input
              type="text"
              name="Квартира"
              value={flat}
              onChange={setFlat}
              autocomplete="off"
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
            <button className={styles.addAddress} onClick={handleAddAddress}>
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
