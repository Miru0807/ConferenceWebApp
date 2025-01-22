import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import bcrypt from "bcrypt";

export const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(value) {
      const saltRounds = 10;
      const hash = bcrypt.hashSync(value, saltRounds);
      this.setDataValue("password", hash);
    },
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // 0 = organizator
  // 1 = author
  // 2 = reviewer
});
