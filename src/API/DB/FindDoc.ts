import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const FindDoc = async <T>(
  uid: string,
  collType: string,
  keyValue: string,
  value: number
): Promise<T> => {
  const citiesRef = collection(db, `users/${uid}/${collType}`);

  const q = query(citiesRef, where(`${keyValue}`, "==", value));
  const querySnapshot = await getDocs(q);
  
  const data: T[] = [];
  
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data[0];
};

export default FindDoc;
