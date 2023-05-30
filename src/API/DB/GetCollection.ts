import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const GetCollection = async <T>(email: string, colType: string): Promise<T[]> => {
  const querySnapshot = await getDocs(
    collection(db, `users/${email}/${colType}`)
  );

  const data: T[] = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data;
};

export default GetCollection;
