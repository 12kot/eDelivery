import React, { ReactElement } from "react";
import styles from "./Categories.module.css";
import CategoryIyem from "./Category/CategoryItem";
import { useAppSelector } from "hooks/hooks";
import { CategoryType } from "types/types";
import { v4 } from "uuid";

const Categories = (): ReactElement => {
  const categories = useAppSelector((state) => state.app.categories);

  const getCategories = (): ReactElement[] => {
    if (!categories.length) return [<CategoryIyem category="Категории отсутсвуют" link="" key={v4()} />];
    
    return categories.map((category: CategoryType) => (
      <CategoryIyem {...category} key={v4()} />
    ));
  };

  return <div className={styles.container}>{getCategories()}</div>;
};

export default Categories;
