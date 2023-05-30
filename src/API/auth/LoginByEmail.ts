import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthUser } from "types/types";
import { emptyAuthUser } from "./emptyAuthUser";

const LoginByEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const user: AuthUser = emptyAuthUser;

  await signInWithEmailAndPassword(auth, email, password)
    .then(async (response) => {
      if (response.user.email) {
        user.email = response.user.email;
        user.uid = response.user.uid;
        user.token = await response.user.getIdToken();

        localStorage.setItem("user", JSON.stringify(user));
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return user;
};

export default LoginByEmail;
