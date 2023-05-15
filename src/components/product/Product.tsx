import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.css";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { fetchData } from "store/slices/appSlice";
import Loader from "ui/loader/Loader";
import heartIcon from "images/icons/heart.png";
import ProductsSwiper from "components/main/products/ProductsSwiper";

const Product = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { category, id } = useParams();

  const { currentProduct, isLoading } = useAppSelector((state) => state.app);
  const products = useAppSelector((state) => state.app.products.products);
  console.log(products);

  useEffect(() => {
    dispatch(
      fetchData({ path: `products/${category}/${id}`, type: "SET_PRODUCT" })
    );
    dispatch(
      fetchData({ path: `products/${category}`, type: "SET_ALL_PRODUCTS" })
    );
  }, [category, id]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {currentProduct?.name ? (
            <>
              <h2>{currentProduct?.name}</h2>
              <div className={styles.content}>
                <img src={currentProduct.imageURL} alt={currentProduct.name} />
                <div className={styles.description}>
                  <div className={styles.item}>
                    <h4>Описание продукта</h4>
                    <p>{currentProduct.description}</p>
                  </div>
                  <div className={styles.item}>
                    <h4>Страна производитель </h4>
                    <p>{currentProduct.location}</p>
                  </div>
                  <div className={styles.item}>
                    <h4>Производитель </h4>
                    <p>{currentProduct.brand}</p>
                  </div>
                  <div className={styles.item}>
                    <h4>Артикул </h4>
                    <p>{currentProduct.id}</p>
                  </div>
                </div>

                <div className={styles.basket_container}>
                  <div className={styles.to_basket}>
                    <button>
                      <img src={heartIcon} alt="heart" />
                      <p>В избранное</p>
                    </button>
                  </div>

                    <div className={currentProduct.isDiscount ? `${styles.basket} ${styles.discount}` : `${styles.content}`}>
                    <h2>{currentProduct.price} р.</h2>
                    <div className={styles.button}>
                      <button>В корзину</button>
                    </div>
                  </div>
                </div>
              </div>
              <ProductsSwiper
                heading="Подобока похожих товаров"
                products={products}
              />
              <div className={styles.mobile_menu}>
                <div className={styles.mobile_basket}>
                  <button>Добавить в корзину</button>
                </div>
                <div className={styles.mobile_heart}>
                  <button>
                    <img src={heartIcon} alt="heart" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <h2>Продукт не найден</h2>
          )}
        </>
      )}
    </div>
  );
};

export default Product;
