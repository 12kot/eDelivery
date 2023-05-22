import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ProductType } from "types/types";

const SetDoc = async (email: string, collType: string, product: ProductType) => {
  await setDoc(
    doc(db, `users/${email}/${collType}`, product.id.toString()),
    product
  ).then().catch(e => {console.log(e)});
};

export default SetDoc;
