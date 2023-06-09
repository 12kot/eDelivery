import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthUser } from "types/types";

const CreateUser = async (user: AuthUser): Promise<void> => {
  await setDoc(doc(db, `users/`, user.uid), user);
};

export default CreateUser;
