import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UpdateProfileInfo = async (userUID: string, data: any): Promise<void> => {
  await updateDoc(doc(db, `users/`, userUID), data);
};

export default UpdateProfileInfo;
