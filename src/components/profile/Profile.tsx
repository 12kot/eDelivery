import { useAppDispatch, useAppSelector } from "hooks/hooks";
import React, { ReactElement } from "react";
import { logoutUser } from "store/slices/userSlice";

const Profile = (): ReactElement => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(logoutUser());
  }
  
  return (
    <div>
      <h2>{user.email}</h2>
      <button onClick={handleClick}>Выйти</button>
    </div>
  );
};

export default Profile;
