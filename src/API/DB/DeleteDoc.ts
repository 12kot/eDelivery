import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DeleteDoc = async (email: string, collType: string, id: number) => {
  await deleteDoc(doc(db, `users/${email}/${collType}`, id.toString()));
};

export default DeleteDoc;
