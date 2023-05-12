import React, { ReactElement } from "react";
import styles from "./Categories.module.css";
import Category from "./Category/Category";
import { useAppSelector } from "hooks/hooks";
import { CategoryType } from "types/types";
import { v4 } from "uuid";

const Categories = (): ReactElement => {
  const categories = useAppSelector((state) => state.app.categories);

  const getCategories = (): ReactElement[] => {
    return categories.map((category: CategoryType) => (
      <Category category={category.category} link={category.link} key={v4()} />
    ));
  };

  return <div className={styles.container}>{getCategories()}</div>;
};

export default Categories;
