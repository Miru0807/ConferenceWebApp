import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import { User } from "./user.js";

export const Conference = db.define("conference", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  text: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

User.hasMany(Conference, { foreignKey: "userId" });
Conference.belongsTo(User, { foreignKey: "userId" });
