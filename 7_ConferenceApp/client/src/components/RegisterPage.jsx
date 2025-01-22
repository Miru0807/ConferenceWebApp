import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("0"); // Default to 'organizator'
  const navigate = useNavigate();

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, type }),
      });

      const res = await response.json();

      if (response.status === 201) {
        alert(res.message);
        navigate("/login");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  return (
    <div className="bg-purple-500 h-screen flex items-center justify-center">
      <div className="bg-purple-400 px-12 py-8 rounded-xl space-y-4">
        <h2 className="text-white text-center">Create New User</h2>
        <div className="text-white">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-white">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-white">
          <label htmlFor="type">Role</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">Organizator</option>
            <option value="1">Author</option>
            <option value="2">Reviewer</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCreateUser}
            className="inline-flex py-2 px-4 rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Create User
          </button>
        </div>
        <div className="text-white">
          <p
            className="underline cursor-pointer mt-4"
            onClick={() => navigate("/login")}
          >
            Existing user? Login
          </p>
        </div>
      </div>
    </div>
  );
};
