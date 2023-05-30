import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UpdateProfileInfo = async (userUID: string, data: any) => {
  await updateDoc(doc(db, `users/`, userUID), data)
    .then()
    .catch((e) => {
      console.log(e);
    });
};

export default UpdateProfileInfo;
