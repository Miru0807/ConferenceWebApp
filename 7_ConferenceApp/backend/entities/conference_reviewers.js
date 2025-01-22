import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import { User } from "./user.js";
import { Conference } from "./conference.js"; // Import the Conference model

export const ConferenceReviewer = db.define("conference_reviewer", {
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
  reviewerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Conference.belongsToMany(User, {
  through: ConferenceReviewer,
  foreignKey: "conferenceId",
});
User.belongsToMany(Conference, {
  through: ConferenceReviewer,
  foreignKey: "reviewerId",
});
