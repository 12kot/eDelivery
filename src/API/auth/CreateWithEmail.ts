import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthUser } from "types/types";

const CreateWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const user: AuthUser = {
    email: "",
    uid: "",
    token: "",
  };

  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (response) => {
      if (response.user.email) {
        user.email = response.user.email;
        user.uid = response.user.uid;
        user.token = await response.user.getIdToken();

        localStorage.setItem("user", JSON.stringify(user));
      }
    })
    .catch((error) => {console.error(error)});

  return user;
};

export default CreateWithEmailAndPassword;