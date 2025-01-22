import { Article } from "../entities/article.js";
import { getAllUsers } from "./userDa.js";
import { User } from "../entities/user.js";
import { addArticleReviewers } from "./articleReviewerDa.js";
import { getConferenceDetailsById } from "./conferenceDa.js";
import { ArticleReviewer } from "../entities/article_reviewer.js";

export const getArticlesByConferenceId = async (conferenceId) => {
  try {
    const articles = await Article.findAll({
      where: { conferenceId },
    });

    if (!articles.length) {
      return [];
    }

    const users = await getAllUsers();
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.id, user.username);
    });

    const articleIds = articles.map((article) => article.id);
    const allArticleReviewers = await ArticleReviewer.findAll({
      where: { articleId: articleIds },
    });

    const reviewersByArticle = allArticleReviewers.reduce((acc, reviewer) => {
      if (!acc[reviewer.articleId]) {
        acc[reviewer.articleId] = [];
      }
      acc[reviewer.articleId].push(reviewer.userId);
      return acc;
    }, {});

    const articlesWithReviewers = articles.map((article) => {
      const user = userMap.get(article.userId) || "admin";
      const reviewerIds = reviewersByArticle[article.id] || [];
      const reviewerNames = reviewerIds
        .map((id) => userMap.get(id) || "Unknown Reviewer")
        .join(", ");

      return {
        ...article.toJSON(),
        user: { username: user },
        allowedReviewers: reviewerIds,
        reviewerNames,
      };
    });

    return articlesWithReviewers;
  } catch (err) {
    throw new Error("Error fetching articles: " + err.message);
  }
};

export const createArticle = async (conferenceId, text, userId) => {
  try {
    const newArticle = await Article.create({
      conferenceId,
      text,
      userId,
    });

    const conferenceDetails = await getConferenceDetailsById(conferenceId);

    if (conferenceDetails.error) {
      throw new Error(conferenceDetails.error);
    }

    const reviewers = conferenceDetails.conference.reviewers;
    if (reviewers.length < 2) {
      throw new Error("Not enough reviewers for this conference.");
    }

    const selectedReviewers = [];
    while (selectedReviewers.length < 2) {
      const randomReviewer =
        reviewers[Math.floor(Math.random() * reviewers.length)];
      if (!selectedReviewers.includes(randomReviewer)) {
        selectedReviewers.push(randomReviewer);
      }
    }

    const reviewerIds = selectedReviewers.map((reviewer) => reviewer.userId);
    await addArticleReviewers(newArticle.id, reviewerIds);

    const articleWithUser = await Article.findByPk(newArticle.id, {
      include: {
        model: User,
        attributes: ["id", "username"],
      },
    });
    return {
      article: articleWithUser,
      reviewers: selectedReviewers,
    };
  } catch (err) {
    throw new Error("Error creating article: " + err.message);
  }
};
