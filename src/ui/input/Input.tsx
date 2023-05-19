import React, { Dispatch, ReactElement, SetStateAction } from "react";
import styles from "./Input.module.css";

type Props = {
  name: string;
  type: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  autocomplete: string;
};

const Input = (props: Props): ReactElement => {
  return (
    <div className={styles.coolinput}>
      <label htmlFor="input" className={styles.text}>
        {props.name}
      </label>
      <input
        type={props.type}
        name={props.type}
        autoComplete={props.autocomplete}
        placeholder={`Пишите здесь...`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};

export default Input;
