import { getDatabase, ref, child, get } from "firebase/database";

const getDataDB = async <T>(path: string): Promise<T | undefined> => {
  let data: T | undefined;
  const dbRef = ref(getDatabase());

  await get(child(dbRef, `${path}`)).then((snapshot) => {
    if (snapshot.exists()) {
      data = snapshot.val();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

  return data;
};

export default getDataDB;
