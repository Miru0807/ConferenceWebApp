import { Feedback } from "../entities/feedback.js";
import { User } from "../entities/user.js";

export const getFeedbacksByArticleId = async (articleId) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { articleId },
      include: {
        model: User,
        attributes: ["id", "username"],
      },
    });
    return feedbacks;
  } catch (err) {
    throw new Error("Error fetching feedbacks: " + err.message);
  }
};

export const createFeedback = async (articleId, userId, text) => {
  try {
    const newFeedback = await Feedback.create({
      articleId,
      userId,
      text,
    });
    return newFeedback;
  } catch (err) {
    throw new Error("Error creating feedback: " + err.message);
  }
};
