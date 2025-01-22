import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Conferences } from "./components/Conferences";
import { UserProvider } from "./contexts/UserContext";
import { Conference } from "./components/Conference";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Conferences />} />
        <Route path="/:id" element={<Conference />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </UserProvider>
  </Router>
);
