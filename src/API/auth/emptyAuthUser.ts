import { AuthUser } from "types/types";

export const emptyAuthUser: AuthUser = {
  email: "",
  uid: "",
  token: "",
  currentAddress: {
    city: "",
    street: "",
    houseNumber: "",
    block: "",
    entrance: "",
    floor: "",
    flat: "",
    id: "",
  },
};
