import express from "express";
import { authenticateToken } from "../middleware.js";
import * as articleDA from "../dataAccess/articleDa.js";

const articleRouter = express.Router();

articleRouter.get("/:conferenceId", authenticateToken, async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const articles = await articleDA.getArticlesByConferenceId(conferenceId);
    res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

articleRouter.post("/:conferenceId", authenticateToken, async (req, res) => {
  const { conferenceId } = req.params;
  const { text, userId } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Article text is required." });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const newArticle = await articleDA.createArticle(
      conferenceId,
      text,
      userId
    );
    res.status(201).json(newArticle);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default articleRouter;
