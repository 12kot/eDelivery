import React, { ReactElement, useState, useEffect } from "react";
import styles from "./Addreses.module.css";
import Address from "./address/Address";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import AddressModal from "./addressModal/AddressModal";
import Loader from "ui/loader/Loader";
import { fetchUserAddresses } from "store/slices/userSlice";

const Addresses = (): ReactElement => {
  const addresses = useAppSelector((state) => state.user.currentUser.addresses);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserAddresses())
  }, [dispatch]);
  
  const getAddresses = (): ReactElement[] => {
    return addresses.map((address) => <Address address={address} key={v4()} />);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loader /> : <></>}
      <h3>Адреса доставки</h3>
      <div className={styles.addresses}>{getAddresses()}</div>
      <button
        className={styles.add_address}
        onClick={() => {
          setIsActive(true);
        }}
      >
        Добавить новый адрес
      </button>
      <AddressModal isActive={isActive} header={"Добавить новый адрес"} setIsActive={ setIsActive } />
    </div>
  );
};

export default Addresses;
