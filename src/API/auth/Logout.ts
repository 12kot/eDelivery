import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Logout = async () => {
  await signOut(auth).then(() => {
    localStorage.clear();
  });
};

export default Logout;
