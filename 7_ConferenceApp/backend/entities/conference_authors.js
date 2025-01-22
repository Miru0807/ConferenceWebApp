import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import { User } from "./user.js";
import { Conference } from "./conference.js";

export const ConferenceAuthor = db.define("conference_author", {
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
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Conference.belongsToMany(User, {
  through: ConferenceAuthor,
  foreignKey: "conferenceId",
});
User.belongsToMany(Conference, {
  through: ConferenceAuthor,
  foreignKey: "authorId",
});
