import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const FindDocInCollection = async <T>(
  uid: string,
  collType: string,
  keyValue: string,
  value: number | string
): Promise<T> => {
  const ref = collection(db, `users/${uid}/${collType}`);

  const q = query(ref, where(`${keyValue}`, "==", value));
  const querySnapshot = await getDocs(q);
  
  const data: T[] = [];
  
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data[0];
};

export default FindDocInCollection;
