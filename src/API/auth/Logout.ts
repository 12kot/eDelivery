import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const GoogleSignOut = async () => {
  await signOut(auth).then(() => {
    localStorage.clear();
  });
};

export default GoogleSignOut;
