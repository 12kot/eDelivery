import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";

const getNumberOfItems = async (path: string, equalKey: string | null, equalValue: string | boolean| null | number): Promise<number> => {
  let data: number = 0;
  const db = getDatabase();
  let q = query(ref(db, path));

  if (equalValue && equalKey)
    q = query(ref(db, path), orderByChild("id"), equalTo(equalValue));

  await get(q).then((snapshot) => {
    if (snapshot.exists()) {
        data = snapshot.size;
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
    
  return data;
};

export default getNumberOfItems;
