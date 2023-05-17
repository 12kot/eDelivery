export type CategoryType = {
  category: string,
  link: string,
};

export type ProductType = {
  isDiscount: boolean,
  name: string, 
  id: number,
  price: number,
  description: string,
  composition: string,
  quantity: number,
  imageURL: string,
  category: string,
  location: string,
  brand: string,
};

type searchProducts = {
  products: ProductType[],
  totalNumberOfItems: number,
}
export type ProductCategoriesType = {
  products: ProductType[],
  search: searchProducts,
}

export type BannerType = {
  imageURL: string,
  link: string,
};
