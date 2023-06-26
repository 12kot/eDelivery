import { AuthUser } from "types/types";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { emptyAuthUser } from "./emptyAuthUser";

const LoginByGoogle = async (): Promise<{data: AuthUser, error: Error | null}> => {
  const user: AuthUser = emptyAuthUser;
  let error: Error | null = null;
  
  try {
    const response = await signInWithPopup(auth, provider);
    if (response.user.email) {
      user.email = response.user.email;
      user.uid = response.user.uid;
      user.token = await response.user.getIdToken();

      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    error = e as Error;
  }

  // let str: AuthUser = JSON.parse(localStorage.getItem("user") as string);
  // console.log(str);

  return {data: user, error: error};
};

export default LoginByGoogle;
