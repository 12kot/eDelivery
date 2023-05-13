import { getDatabase, ref, child, get } from "firebase/database";
import { ProductType } from "types/types";

const getCategoryData = async (category: string): Promise<ProductType[] | undefined> => {
  let data: ProductType[] | undefined;
  const dbRef = ref(getDatabase());

  await get(child(dbRef, `products/${category}`)).then((snapshot) => {
    if (snapshot.exists()) {
      data = snapshot.val();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

  return data;
};

export default getCategoryData;
