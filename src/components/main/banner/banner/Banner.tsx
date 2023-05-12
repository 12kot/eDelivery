import React, { ReactElement } from "react";
import styles from "./Banner.module.css";
import { NavLink } from "react-router-dom";
import defaultBanner from "images/banners/default.jpg";
import { BannerType } from "types/types";

const Banner = (props: BannerType): ReactElement => {
  const getPath = () => {
      if (props.imageURL.startsWith("https://")) return props.imageURL;
      
      try {
          return require(`images/banners/${props.imageURL}`);
      } catch {
          return require(defaultBanner);
      }
  };

  return (
    <NavLink to={`/${props.link}`} className={`${styles.container}`}>
      <img src={getPath()} alt="banner" />
    </NavLink>
  );
};

export default Banner;
