import React, { ReactElement } from "react";
import styles from "./Addreses.module.css";
import { AddressType } from "types/types";
import Address from "./address/Address";
import { v4 } from "uuid";

type Props = {
  addresses?: AddressType[];
};

const Addresses = (props: Props): ReactElement => {
  const getAddresses = (): ReactElement[] => {
    if (props.addresses)
      return props.addresses.map((address) => (
        <Address address={address} key={v4()} />
      ));

    
    //ТУТ ДОЛЖЕН БЫТЬ ПУСТОЙ ОБЪЕКТ
    return [
      <Address
        address={{
          city: "Гродно",
          street: "БЛК",
          houseNumber: "3",
          block: "1",
          entrance: "1",
          floor: "1",
          flat: "2",
        }}
      />,
    ];
  };

  return (
    <div className={styles.container}>
      <h3>Адреса доставки</h3>
      <div className={styles.addresses}>{getAddresses()}</div>
      <button className={styles.add_address}>Добавить новый адрес</button>
    </div>
  );
};

export default Addresses;
