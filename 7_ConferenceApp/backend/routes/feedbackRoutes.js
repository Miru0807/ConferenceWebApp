import express from "express";
import { authenticateToken } from "../middleware.js";
import * as feedbackDA from "../dataAccess/feedbackDa.js";

const feedbackRouter = express.Router();

feedbackRouter.get("/:articleId", authenticateToken, async (req, res) => {
  const { articleId } = req.params;

  try {
    const feedbacks = await feedbackDA.getFeedbacksByArticleId(articleId);
    res.status(200).json(feedbacks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

feedbackRouter.post("/:articleId", authenticateToken, async (req, res) => {
  const { articleId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Feedback text is required." });
  }

  try {
    const newFeedback = await feedbackDA.createFeedback(
      articleId,
      userId,
      text
    );
    res.status(201).json(newFeedback);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default feedbackRouter;
