import React, { ReactElement } from "react";
import styles from "./Address.module.css";
import { AddressType } from "types/types";

type Props = {
  address: AddressType;
};

const Address = (props: Props): ReactElement => {
  return (
    <div className={styles.container}>
      <p>{`${props.address.city}, ${props.address.street}, д. ${props.address.block}, п. ${props.address.entrance}`}</p>
    </div>
  );
};

export default Address;
