import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInformation } from "../functions/getUserInfo";

export const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: password }),
      });
      const res = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", res.token);
        await getUserInformation(res.token);
        navigate("/");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-purple-500 h-screen">
        <div className="flex items-center justify-center pt-[10%]">
          <div className="bg-purple-400 px-12 py-4 rounded-xl space-y-4 flex flex-col items-center justify-center content-center">
            <div className="text-white">
              <label htmlFor="id">Username</label>
              <input
                name="id"
                type="text"
                onChange={handleChange}
                required
                className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-white">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                required
                className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={login}
                type="submit"
                className="inline-flex py-2 px-4 rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Login
              </button>
            </div>
            <div className="text-white">
              <p
                className="underline cursor-pointer mt-4"
                onClick={() => navigate("/register")}
              >
                New User? Register
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
