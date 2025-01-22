import express from "express";
import db from "../dbConfig.js";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
} from "../dataAccess/userDa.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware.js";

let userRouter = express.Router();

userRouter.post("/create", async (req, res) => {
  try {
    const { username, password, type } = req.body;
    const user = await createUser({ username, password, type });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser({ username, password });
    const token = jwt.sign(
      {
        id: user.dataValues.id,
        username: user.dataValues.username,
        type: user.dataValues.type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/authToken", authenticateToken, (req, res) => {
  const { id, username, type } = req.user;
  res.json({ id, username, type });
});

userRouter.get("/all", authenticateToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/:userid", authenticateToken, async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await getUserById(userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default userRouter;
