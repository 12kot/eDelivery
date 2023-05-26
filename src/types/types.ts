export type CategoryType = {
  category: string;
  link: string;
};

export type ProductType = {
  isDiscount: boolean;
  name: string;
  id: number;
  price: number;
  description: string;
  composition: string;
  quantity: number;
  imageURL: string;
  category: string;
  location: string;
  brand: string;
};

type searchProducts = {
  products: ProductType[];
  totalNumberOfItems: number;
};

export type ProductCategoriesType = {
  products: ProductType[];
  search: searchProducts;
};

export type BannerType = {
  imageURL: string;
  link: string;
};

export type AuthUser = {
  email: string;
  uid: string;
  token: string;
};

export type CurrentUser = {
  email: string;
  uid: string;
  token: string;
  address: AddressType[];
  basket: BasketType;
  favorite: FavoriteType;
};

export type FavoriteType = {
  products: ProductType[]
  items: number[];
}

export type BasketType = {
  products: ProductType[];
  items: BasketItemType[];
}

export type BasketItemType = {
  id: number;
  count: number;
}

export type AddressType = {
  city: string;
  street: string;
  houseNumber: string;
  block: string;
  entrance: string;
  floor: string;
  flat: string;
};
