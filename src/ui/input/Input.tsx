import React, { ReactElement } from "react";
import styles from "./Input.module.css";

type Props = {
  name: string;
};

const Input = (props: Props): ReactElement => {
  return (
    <div className={styles.coolinput}>
      <label htmlFor="input" className={styles.text}>
        {props.name}
      </label>
      <input
        type="text"
        placeholder={`${props.name} здесь...`}
        name="input"
        className={styles.input}
      />
    </div>
  );
};

export default Input;
