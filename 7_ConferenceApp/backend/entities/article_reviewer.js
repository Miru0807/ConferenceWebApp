import { Sequelize } from "sequelize";
import db from "../dbConfig.js";

export const ArticleReviewer = db.define("ArticleReviewer", {
  articleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
