import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import { Conference } from "./conference.js";
import { User } from "./user.js";

export const Article = db.define("article", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  conferenceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Conference,
      key: "id",
    },
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
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Conference.hasMany(Article, { foreignKey: "conferenceId" });
Article.belongsTo(Conference, { foreignKey: "conferenceId" });
User.hasMany(Article, { foreignKey: "userId" });
Article.belongsTo(User, { foreignKey: "userId" });
