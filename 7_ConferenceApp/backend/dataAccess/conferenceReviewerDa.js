import { ConferenceReviewer } from "../entities/conference_reviewers.js";

export async function addReviewersToConference(conferenceId, reviewerIds) {
  try {
    const uniqueReviewerIds = [...new Set(reviewerIds)];

    const reviewersToAdd = uniqueReviewerIds.map((reviewerId) => ({
      conferenceId,
      reviewerId,
    }));

    await ConferenceReviewer.bulkCreate(reviewersToAdd, {
      ignoreDuplicates: true,
    });

    return { conferenceId, reviewerIds: uniqueReviewerIds };
  } catch (err) {
    throw new Error("Error adding reviewers to conference: " + err.message);
  }
}
