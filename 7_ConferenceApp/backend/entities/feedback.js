import { Sequelize } from "sequelize";
import db from "../dbConfig.js";
import { Article } from "./article.js";
import { User } from "./user.js";

export const Feedback = db.define("feedback", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  articleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Article,
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

Article.hasMany(Feedback, { foreignKey: "articleId" });
Feedback.belongsTo(Article, { foreignKey: "articleId" });

User.hasMany(Feedback, { foreignKey: "userId" });
Feedback.belongsTo(User, { foreignKey: "userId" });
