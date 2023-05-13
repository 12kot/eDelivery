export type CategoryType = {
  category: string,
  link: string,
};

export type ProductType = {
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

export type ProductCategoriesType = {
  products: ProductType[],
  milk?: ProductType[],
  fruits?: ProductType[],
  vegetables?: ProductType[],
  discounds?: ProductType[],
  drinks?: ProductType[],
  meet?: ProductType[],
}

export type BannerType = {
  imageURL: string,
  link: string,
};
