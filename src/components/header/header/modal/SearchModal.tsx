import React, { Dispatch, ReactElement, SetStateAction } from "react";
import styles from "./SearchModal.module.css";
import { useAppSelector } from "hooks/hooks";
import Product from "./product/Product";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

type Props = {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

const SeachModal = (props: Props): ReactElement => {
  const { products } = useAppSelector((state) => state.app.products.search);
  const navigate = useNavigate();

  const getItems = (): ReactElement[] => {
    return products.map((product) => <Product product={product} setActive={props.setActive} key={v4()} />);
  };

  const handleClick = () => {
    props.setSearchValue("");
    navigate(`search/${props.searchValue}`);
  };

  return (
    <div
      className={
        props.active ? `${styles.modal} ${styles.active}` : `${styles.modal}`
      }
      onClick={() => props.setActive(false)}
    >
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.items}>{getItems()}</div>
        {getItems().length !== 0 ? (
          <button className={styles.open_all} onClick={handleClick}>
            Смотреть всё
          </button>
        ) : (
          <h4 className={styles.error}>Мы ничего не нашли :(</h4>
        )}
      </div>
      <div className={styles.close_modal}>
        <button>
          <p>Закрыть</p>
        </button>
      </div>
    </div>
  );
};

export default SeachModal;
