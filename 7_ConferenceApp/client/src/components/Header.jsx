import React from "react";
import { getUserType } from "../functions/getUserType";
import { useNavigate } from "react-router-dom";

export const Header = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const main = () => {
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <div className="bg-purple-400 flex flex-row justify-between items-center px-4 py-1 sm:px-12 sm:py-3">
        <div className="text-md sm:text-2xl">
          <span>Buna,</span>
          <span className="text-red-700 mx-2">{getUserType(user.type)}</span>
          <span>{user.username}</span>
        </div>
        <div>
          <button
            onClick={() => main()}
            className="mr-2 inline-flex py-2 px-4 rounded-xl bg-green-300 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Conferinte
          </button>
          <button
            onClick={() => logout()}
            className="inline-flex py-2 px-4 rounded-xl bg-yellow-300 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
