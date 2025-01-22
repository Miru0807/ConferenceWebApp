import { ConferenceAuthor } from "../entities/conference_authors.js";

export async function addAuthorsToConference(conferenceId, authorIds) {
  try {
    const uniqueAuthorIds = [...new Set(authorIds)];

    const authorsToAdd = uniqueAuthorIds.map((authorId) => ({
      conferenceId,
      authorId,
    }));

    await ConferenceAuthor.bulkCreate(authorsToAdd, {
      ignoreDuplicates: true,
    });

    return { conferenceId, authorIds: uniqueAuthorIds };
  } catch (err) {
    throw new Error("Error adding authors to conference: " + err.message);
  }
}
