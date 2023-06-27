import {
  getDatabase,
  ref,
  get,
  query,
} from "firebase/database";

const getNumberOfItems = async (
  path: string
): Promise<number> => {
  let data: number = 0;
  const db = getDatabase();
  let q = query(ref(db, path));

  const snapshot = await get(q);
  
  try {
    if (snapshot.exists()) {
      data = snapshot.size;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }

  return data;
};

export default getNumberOfItems;
