import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DeleteDoc = async (uid: string, collType: string, id: number) => {
  await deleteDoc(doc(db, `users/${uid}/${collType}`, id.toString()));
};

export default DeleteDoc;
