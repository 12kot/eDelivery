import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
  limitToFirst,
} from "firebase/database";

const getSearchItems = async <T>(
  path: string,
  equalKey: string,
  equalValue: string,
  count: number
): Promise<T[]> => {
  let data: T[] = [];

  const db = getDatabase();
  let q = query(
    ref(db, path),
    orderByChild(equalKey),
    limitToFirst(count),
    startAt(equalValue),
    endAt(`${equalValue}\uf8ff`)
  );

  const snapshot = await get(q);
  
  try {
    if (snapshot.exists()) {
      data = snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }

  return data;
};

export default getSearchItems;
