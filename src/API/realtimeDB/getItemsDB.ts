import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
} from "firebase/database";

const getItemsDB = async <T>(
  path: string,
  equalKey: string | null,
  equalValue: number | string | boolean | null,
  count: number
): Promise<T[]> => {
  let data: T[] = [];
  const db = getDatabase();
  let q = query(ref(db, path), limitToFirst(count));

  if (equalValue && equalKey)
    q = query(
      ref(db, path),
      limitToFirst(count),
      orderByChild(equalKey),
      equalTo(equalValue)
    );

  const snapshot = await get(q);
  
  try {
    if (snapshot.exists()) {
      data = Object.values(snapshot.val());
    } else {
      console.log("No data available");
    }
  } catch (e) {
    console.error(e);
  }

  return data;
};

export default getItemsDB;
