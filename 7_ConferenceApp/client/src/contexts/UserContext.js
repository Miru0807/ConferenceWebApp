import React, { createContext, useState, useEffect } from "react";
import { getUserInformation } from "./../functions/getUserInfo";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
      if (token) {
        const userData = await getUserInformation(token);
        if (userData) {
          setLoggedIn(true);
          setUser(userData);
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    if (location.pathname !== "/login" && location.pathname !== "/register") {
      fetchUser();
    }
  }, [location.pathname, navigate]);

  return (
    <UserContext.Provider value={{ loggedIn, user }}>
      {children}
    </UserContext.Provider>
  );
};
