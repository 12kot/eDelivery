import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { BasketItemType } from "types/types";

const UpdateBasketDoc = async (
  uid: string,
  collType: string,
  item: BasketItemType
) => {
  const washingtonRef = doc(
    db,
    `users/${uid}/${collType}`,
    item.product.id.toString()
  );

  await updateDoc(washingtonRef, {
    count: item.count,
  });
};

export default UpdateBasketDoc;
