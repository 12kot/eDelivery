import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ProductType } from "types/types";

const SetProduct = async (uid: string, collType: string, product: ProductType) => {
  await setDoc(
    doc(db, `users/${uid}/${collType}`, product.id.toString()),
    product
  ).then().catch(e => {console.log(e)});
};

export default SetProduct;
