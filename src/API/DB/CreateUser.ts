import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthUser } from "types/types";

const CreateUser = async (user: AuthUser) => {
  await setDoc(doc(db, `users/`, user.uid), user)
    .then()
    .catch((e) => {
      console.log(e);
    });
};

export default CreateUser;
