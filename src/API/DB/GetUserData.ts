import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const GetUserData = async <T>(uid: string): Promise<T | undefined> => {
  const ref = doc(db, `users`, uid);
  const data = await getDoc(ref);

  if (data.exists()) return data.data() as T;
  return undefined;
};

export default GetUserData;
