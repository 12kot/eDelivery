import { AuthUser } from "types/types";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const LoginByGoogle = async (): Promise<AuthUser> => {
  let user: AuthUser = {
    email: "",
    uid: "",
    token: "",
  };

  await signInWithPopup(auth, provider)
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

  // let str: AuthUser = JSON.parse(localStorage.getItem("user") as string);
  // console.log(str);

  return user;
};

export default LoginByGoogle;
