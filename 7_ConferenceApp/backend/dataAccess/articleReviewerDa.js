import { ArticleReviewer } from "../entities/article_reviewer.js";

export const addArticleReviewers = async (articleId, reviewerIds) => {
  try {
    const reviewEntries = reviewerIds.map((userId) => ({
      articleId,
      userId,
    }));
    await ArticleReviewer.bulkCreate(reviewEntries);
    return true;
  } catch (err) {
    console.error("Error adding article reviewers:", err);
    throw new Error("Failed to add article reviewers");
  }
};
