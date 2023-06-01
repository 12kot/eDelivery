import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthUser } from "types/types";
import { emptyAuthUser } from "./emptyAuthUser";

const CreateWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const user: AuthUser = emptyAuthUser;

  const response = await createUserWithEmailAndPassword(auth, email, password);
  
  try {
    if (response.user.email) {
      user.email = response.user.email;
      user.uid = response.user.uid;
      user.token = await response.user.getIdToken();

      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (error) {
    console.error(error);
  }

  return user;
};

export default CreateWithEmailAndPassword;
