import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthUser } from "types/types";
import { emptyAuthUser } from "./emptyAuthUser";

const CreateWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{data: AuthUser, error: Error | null}> => {
  const user: AuthUser = emptyAuthUser;
  let error: Error | null = null;

  
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (response.user.email) {
      user.email = response.user.email;
      user.uid = response.user.uid;
      user.token = await response.user.getIdToken();

      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    error = e as Error;
  }

  return {data: user, error: error};
};

export default CreateWithEmailAndPassword;
