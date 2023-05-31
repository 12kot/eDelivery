import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UpdateDoc = async (
  uid: string,
  collType: string,
  itemID: string,
  data: any
) => {
  const ref = doc(db, `users/${uid}/${collType}`, itemID);

  await updateDoc(ref, data);
};

export default UpdateDoc;
