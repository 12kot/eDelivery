import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SetDoc = async (uid: string, collType: string, id: string, data: any) => {
  await setDoc(doc(db, `users/${uid}/${collType}`, id), data);
};

export default SetDoc;
