import React, { Dispatch, ReactElement, SetStateAction } from "react";
import styles from "./Input.module.css";

type Props = {
  name: string;
  type: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  autocomplete: string;
  readonly?: boolean
};

const Input = (props: Props): ReactElement => {
  return (
    <div className={props.readonly ? `${styles.coolinput} ${styles.readOnly}` : `${styles.coolinput}`}>
      <label htmlFor="input" className={styles.text}>
        {props.name}
      </label>
      <input
        type={props.type}
        name={props.type}
        autoComplete={props.autocomplete}
        placeholder={`${props.name}...`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={styles.input}
        readOnly={props.readonly ? true : false}
      />
    </div>
  );
};

export default Input;
