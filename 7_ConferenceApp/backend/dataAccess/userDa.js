import { User } from "../entities/user.js";
import mysql from "mysql2";
import dotenv from "dotenv/config";
import bcrypt from "bcrypt";

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "proiect",
});

export async function createUser({ username, password, type }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return await User.create({ username, password, type });
  } else throw new Error("User already exists");
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}

export async function getUserType({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}

export async function getAllUsers() {
  const users = await User.findAll();
  return users;
}

export async function getUserById(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user by ID", error);
  }
}
