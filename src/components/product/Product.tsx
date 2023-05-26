import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.css";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {
  fetchProductData,
  fetchCollectionProductsData,
} from "store/slices/appSlice";
import Loader from "ui/loader/Loader";
import ProductsSwiper from "components/main/products/ProductsSwiper";
import { handleFavoriteProduct } from "store/slices/userSlice";
import ProductActionsButtons from "components/productActionsButtons/ProductActionsButtons";
import Heart from "ui/Heart";

const Product = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { category, id } = useParams<string>();

  const { currentProduct, isLoading } = useAppSelector((state) => state.app);
  const products = useAppSelector((state) => state.app.products.products);
  const favoriteItems = useAppSelector((state) => state.user.currentUser.favorite.items);

  useEffect(() => {
    if (id) dispatch(fetchProductData({ id: id }));
    if (category)
      dispatch(
        fetchCollectionProductsData({
          equalKey: "category",
          equalValue: category,
          count: 15,
        })
      );
  }, [category, id, dispatch]);

  const isFavorite = () => {
    for (const product of favoriteItems) if (product.toString() === id) return true;

    return false;
  };

  const handleFavorite = () => {
    if (!!currentProduct)
      dispatch(handleFavoriteProduct({ productID: currentProduct.id }));
  };

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
                  <span className={styles.to_basket}>
                    <button onClick={handleFavorite}>
                      <span className={isFavorite() ? styles.red_mobile : ""}>
                        <Heart />
                      </span>
                      {isFavorite() ? (
                        <p className={styles.red}>В избранном</p>
                      ) : (
                        <p>В избранное</p>
                      )}
                    </button>
                  </span>

                  <div
                    className={
                      currentProduct.isDiscount
                        ? `${styles.basket} ${styles.discount}`
                        : `${styles.basket}`
                    }
                  >
                    <h2>{currentProduct.price} р.</h2>
                    <div className={styles.button}>
                      <ProductActionsButtons
                        product={currentProduct}
                        favorite={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ProductsSwiper
                heading="Подборка похожих товаров"
                products={products}
              />
              <div className={styles.mobile_menu}>
                <div className={styles.mobile_basket}>
                  <ProductActionsButtons product={currentProduct} favorite={false} />
                </div>
                <div
                  className={
                    isFavorite()
                      ? `${styles.red_mobile} ${styles.mobile_heart}`
                      : styles.mobile_heart
                  }
                >
                  <button onClick={handleFavorite}>
                    <Heart />
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
