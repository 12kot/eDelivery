import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { BasketItemType } from "types/types";

const UpdateBasketDoc = async (
  uid: string,
  collType: string,
  item: BasketItemType
) => {
  const ref = doc(db, `users/${uid}/${collType}`, item.id.toString());

  await updateDoc(ref, {
    count: item.count,
  });
};

export default UpdateBasketDoc;
