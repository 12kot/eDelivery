import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ProductType } from "types/types";

const SetProduct = async (uid: string, collType: string, product: ProductType, count?: number) => {
  const data = count ? { product, count } : product;

  await setDoc(
    doc(db, `users/${uid}/${collType}`, product.id.toString()),
     data
  ).then().catch(e => {console.log(e)});
};

export default SetProduct;
