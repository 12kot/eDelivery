import { getDatabase, ref, get, query, orderByChild, startAt,endAt } from "firebase/database";

const getSearchItems = async <T>(path: string, equalKey: string, equalValue: string): Promise<T[]> => {
    let data: T[] = [];
    const db = getDatabase();
    let q = query(ref(db, "products/products"), orderByChild("name"), startAt(equalValue), endAt(`${equalValue}\uf8ff`));

  await get(q).then((snapshot) => {
    if (snapshot.exists()) {
        data = snapshot.val();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
    console.log(data);
    
    
  return data;
};

export default getSearchItems;
