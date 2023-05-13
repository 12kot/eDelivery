import React, { ReactElement } from "react";
import styles from "./Products.module.css";
import Product from "./product/Product";
import { ProductType } from "types/types";
import { v4 } from "uuid";

import { Mousewheel, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SwipperSettings from "swiper";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/swiper.min.css";

type Props = {
  heading: string;
  products: ProductType[] | undefined;
};

const Products = (props: Props): ReactElement => {
  const getProducts = (): ReactElement[] => {
    if (props.products)
      return props.products.map((product) => (
        <SwiperSlide>
          <Product {...product} key={v4()} />
        </SwiperSlide>
      ));

    return [<></>];
  };

  const swiperSettings = new SwipperSettings(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,

    breakpoints: {
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2.5,
      },
      640: {
        slidesPerView: 3,
      },
      800: {
        slidesPerView: 3.5,
      },
      960: {
        slidesPerView: 3,
      },
      1120: {
        slidesPerView: 3.5,
      },
      1280: {
        slidesPerView: 4,
      },
      1440: {
        slidesPerView: 4.5,
      },
      1600: {
        slidesPerView: 5,
      },
      1760: {
        slidesPerView: 5.5,
      },
    },
  });

  return (
    <>
      {props.products ? (
        <div className={styles.container}>
          <h3>{props.heading}</h3>
          <div className={styles.products}>
            <Swiper
              modules={[Mousewheel, FreeMode]}
              slidesPerView={"auto"}
              freeMode={true}
              mousewheel={true}
            >
              {getProducts()}
            </Swiper>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Products;
