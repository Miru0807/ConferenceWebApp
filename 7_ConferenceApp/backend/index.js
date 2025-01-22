import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import conferenceRouter from "./routes/conferenceRoutes.js";
import articleRouter from "./routes/articleRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";

let app = express();
let router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  const start = new Date().getTime();
  res.on("finish", () => {
    const duration = new Date().getTime() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});
app.use("/api/user", userRouter);
app.use("/api/conferences", conferenceRouter);
app.use("/api/articles", articleRouter);
app.use("/api/feedbacks", feedbackRouter);
let conn;

mysql
  .createConnection({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  })
  .then((connection) => {
    conn = connection;
    return connection.query("CREATE DATABASE IF NOT EXISTS proiect");
  })
  .then(() => {
    return conn.end();
  })
  .catch((err) => {
    console.warn(err);
  });

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
