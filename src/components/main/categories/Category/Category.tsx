import React, { ReactElement } from "react";
import styles from "./Category.module.css";
import { NavLink } from "react-router-dom";
import { CategoryType } from "types/types";

const Category = (props: CategoryType): ReactElement => {
  return (
    <NavLink to={`/${props.link}`} className={styles.container}>
      {props.category}
    </NavLink>
  );
};

export default Category;
