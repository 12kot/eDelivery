import React, { ReactElement, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Head.module.css";
import Actions from "../actions/Actions";
import { useAppDispatch } from "hooks/hooks";
import { fetchSearchItems } from "store/slices/appSlice";
import SeachModal from "./modal/SearchModal";

const Head = (): ReactElement => {
  const [searchValue, setSearchValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSearchItems({ equalKey: "name", equalValue: searchValue, count: 15 }));
    
    if (searchValue) setIsActive(true);
    else setIsActive(false);
   }, [searchValue, dispatch]);

  const handleSearchInput = (e: string) => {
    setSearchValue(e);
  }

  const handleSearchButton = () => {
    setSearchValue("");
    navigate(`search/${searchValue}`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink
          to="/"
          className={
            searchValue !== ""
              ? `${styles.logo} ${styles.nonactive}`
              : `${styles.logo}`
          }
        >
          <h2>LOGO</h2>
        </NavLink>
        <div className={`${styles.container_catalog}`}>
          <button className={`${styles.catalog} ${styles.item}`}>
            <p>Кнопка</p>
          </button>
          <input
            type="text"
            placeholder="Поиск товаров"
            className={`${styles.search} ${styles.item}`}
            value={searchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
        </div>
        <div
          className={
            searchValue !== ""
              ? `${styles.search_button} ${styles.active}`
              : styles.search_button
          }
        >
          <button
            className={styles.btn}
            onClick={handleSearchButton}
          >
            Найти
          </button>
        </div>
        <div className={`${styles.container_actions}`}>
          <Actions isFooter={false} />
        </div>
        {}
        <SeachModal active={isActive} setActive={setIsActive} searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
    </header>
  );
};

export default Head;
