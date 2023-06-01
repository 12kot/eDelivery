import React, { ReactElement, useState } from "react";
import styles from "./Address.module.css";
import { AddressType } from "types/types";
import EditIcon from "images/icons/edit.png";
import DeleteIcon from "images/icons/delete.png";
import AddressModal from "../addressModal/AddressModal";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { deleteAddress, setCurrentAddress } from "store/slices/userSlice";

type Props = {
  address: AddressType;
  isOrder?: boolean;
};

const Address = (props: Props): ReactElement => {
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();
  const isCurrentAddress: boolean =
    useAppSelector((state) => state.user.currentUser.currentAddress.id) ===
    props.address.id;

  const handleEdit = (): void => {
    setIsActive(true);
  };

  const handleDelete = (): void => {
    dispatch(deleteAddress({ id: props.address.id }));
  };

  const handleChooseAddress = (): void => {
    dispatch(setCurrentAddress(props.address));
  };

  return (
    <div
      className={
        props.isOrder
          ? `${styles.isOrder} ${styles.container}`
          : isCurrentAddress
          ? `${styles.currentAddress} ${styles.container}`
          : `${styles.container}`
      }
      onClick={!props.isOrder ? handleChooseAddress : () => {}}
    >
      <p className={styles.description}>
        {`${props.address.city}, ${props.address.street}, д. ${props.address.houseNumber}`}{" "}
        {props.address.entrance ? `, п. ${props.address.entrance}` : ""}
      </p>

      {!props.isOrder ? (
        <span className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button onClick={handleDelete}>
            <img src={DeleteIcon} alt="delete"></img>
          </button>
          <button onClick={handleEdit}>
            <img src={EditIcon} alt="edit"></img>
          </button>
        </span>
      ) : (
        <></>
      )}

      <AddressModal
        isActive={isActive}
        setIsActive={setIsActive}
        address={props.address}
        header={"Редактирование адреса"}
      />
    </div>
  );
};

export default Address;
