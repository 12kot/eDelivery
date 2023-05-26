import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SetProduct = async (uid: string, collType: string, productID: number, count?: number) => {
  const data = count ? { id: productID, count } : { id: productID };

  await setDoc(
    doc(db, `users/${uid}/${collType}`, productID.toString()), data
  ).then().catch(e => {console.log(e)});
};

export default SetProduct;
