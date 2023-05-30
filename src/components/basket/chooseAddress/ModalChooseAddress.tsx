import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import styles from "components/commonObjects/modalStyles/ModalStyles.module.css";
import { useAppSelector } from "hooks/hooks";
import Address from "components/profile/profile/adresses/address/Address";
import { v4 } from "uuid";
import AddressModal from "components/profile/profile/adresses/addressModal/AddressModal";

type Props = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};

const ModalChooseAddress = (props: Props): ReactElement => {
  const addresses = useAppSelector((state) => state.user.currentUser.addresses);
  const [isActive, setIsActive] = useState(false);

  const getAddresses = (): ReactElement[] => {
    return addresses.map((address) => (
      <span className={styles.item} key={v4()}>
        <Address address={address} />
      </span>
    ));
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
          <h3>Выберите адрес доставки</h3>

          <div className={styles.items}>
            {addresses.length === 0 ? "Адреса отсутствуют" : getAddresses()}
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
            <button className={styles.addAddress} onClick={() => {setIsActive(true)}}>
              Добавить новый адрес
            </button>
          </div>
        </div>
        </div>
          
      <AddressModal
        isActive={isActive}
        header={"Добавить новый адрес"}
        setIsActive={setIsActive}
      />
    </div>
  );
};

export default ModalChooseAddress;
