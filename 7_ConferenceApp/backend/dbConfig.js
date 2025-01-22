import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "mysql",
  database: "proiect",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});
export default db;
