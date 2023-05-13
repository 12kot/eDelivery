import React, { ReactElement } from "react";
import styles from "./Banners.module.css";
import Banner from "./banner/Banner";
import { useAppSelector } from "hooks/hooks";
import { BannerType } from "types/types";
import { v4 } from "uuid";

const Banners = (): ReactElement => {
  const banners = useAppSelector((state) => state.app.banners);

  const getBanners = (): ReactElement[] => {
    if (!banners.length)
      return [
          <Banner imageURL="default.jpg" link="" key={v4()} />
      ];

    return banners.map((banner: BannerType) => (
        <Banner {...banner} key={v4()} />
    ));
  };

  return <div className={styles.container}>{getBanners()}</div>;
};

export default Banners;
