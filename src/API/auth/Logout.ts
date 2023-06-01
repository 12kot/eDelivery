import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Logout = async (): Promise<void> => {
  await signOut(auth);

  localStorage.clear();
};

export default Logout;
