import { getDatabase, ref, update } from "firebase/database";

const editItem = async (productID: number, data: any) => {
  const db = getDatabase();
  await update(ref(db, `products/products/${productID}`), data);
};

export default editItem;
