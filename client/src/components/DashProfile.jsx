import React from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl ">Profile</h1>
      <form className="flex flex-col">
        <div className="w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-yellow-300 object-cover"
          />
        </div>
        <h1 className="self-center mt-5 text-3xl ">{currentUser.username}</h1>
        <h1 className="self-center mt-5 text-lg ">{currentUser.email}</h1>
      </form>
    </div>
  );
}
