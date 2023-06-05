import React, { Dispatch, ReactElement, SetStateAction } from "react";
import styles from "./Select.module.css";
import { v4 } from "uuid";

type Props = {
  options: {
    key: string;
    value: string;
  }[];
  onChange: Dispatch<SetStateAction<string>>;
  value: string;
};

const Select = (props: Props): ReactElement => {
  const getOptions = (): ReactElement[] => {
    return props.options.map((option) => (
      <option value={option.key} key={v4()}>
        {option.value}
      </option>
    ));
  };

  return (
    <div className={styles.coolinput}>
      <label htmlFor="input" className={styles.text}>
        {"Пол"}
      </label>
      <select
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        value={props.value}
      >
        {getOptions()}
      </select>
    </div>
  );
};

export default Select;
