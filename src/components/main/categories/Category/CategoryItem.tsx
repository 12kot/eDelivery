import React, { ReactElement } from "react";
import styles from "./CategoryItem.module.css";
import { NavLink } from "react-router-dom";
import { CategoryType } from "types/types";

const CategoryIyem = (props: CategoryType): ReactElement => {
  return (
    <NavLink to={`/${props.link}`} className={styles.container}>
      {props.category}
    </NavLink>
  );
};

export default CategoryIyem;
