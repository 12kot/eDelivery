import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  startAt,
  endAt
} from "firebase/database";

const getSearchNumberOfItems = async (
  path: string,
  equalKey: string,
  equalValue: string
): Promise<number> => {

  let data: number = 0;

  const db = getDatabase();
  let q = query(
    ref(db, path),
    orderByChild(equalKey),
    startAt(equalValue),
    endAt(`${equalValue}\uf8ff`)
  );

  await get(q)
    .then((snapshot) => {
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

export default getSearchNumberOfItems;
