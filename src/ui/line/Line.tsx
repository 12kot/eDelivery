import React, { ReactElement } from "react";
import styles from "./Line.module.css";

type Props = {
  text: string;
};

const Line = (props: Props): ReactElement => {
  return (
    <div className={styles.line_container}>
      <p>
        <span>{props.text}</span>
      </p>
    </div>
  );
};

export default Line;
