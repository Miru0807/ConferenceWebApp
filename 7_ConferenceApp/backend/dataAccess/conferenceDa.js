import { Conference } from "../entities/conference.js";
import { User } from "../entities/user.js";
import { ConferenceAuthor } from "../entities/conference_authors.js";
import { ConferenceReviewer } from "../entities/conference_reviewers.js";

export async function getAllConferences() {
  try {
    const conferences = await Conference.findAll({
      include: {
        model: User,
        attributes: ["username"],
      },
    });

    return conferences.map((conference) => {
      return {
        ...conference.toJSON(),
        user: conference.user.username,
      };
    });
  } catch (error) {
    throw new Error("Error fetching conferences: " + error.message);
  }
}

export async function createConference({ userId, text }) {
  try {
    const newConference = await Conference.create({ userId, text });
    return newConference;
  } catch (error) {
    throw new Error("Error creating conference: " + error.message);
  }
}

export const getConferenceById = async (conferenceId) => {
  try {
    const conference = await Conference.findByPk(conferenceId);
    if (!conference) {
      throw new Error("Conference not found");
    }
    return conference;
  } catch (err) {
    throw new Error(`Error fetching conference: ${err.message}`);
  }
};

export const getConferenceDetailsById = async (conferenceId) => {
  try {
    const conference = await Conference.findByPk(conferenceId);
    if (!conference) return { error: "Conference not found" };

    const creator = await User.findByPk(conference.userId, {
      attributes: ["id", "username"],
    });
    if (!creator) return { error: "Creator not found" };

    const conferenceAuthors = await ConferenceAuthor.findAll({
      where: { conferenceId },
    });

    const authors = [];
    for (const author of conferenceAuthors) {
      const user = await User.findByPk(author.authorId, {
        attributes: ["id", "username"],
      });
      if (user) {
        authors.push({ userId: user.id, username: user.username });
      }
    }

    const conferenceReviewers = await ConferenceReviewer.findAll({
      where: { conferenceId },
    });

    const reviewers = [];
    for (const reviewer of conferenceReviewers) {
      const user = await User.findByPk(reviewer.reviewerId, {
        attributes: ["id", "username"],
      });
      if (user) {
        reviewers.push({ userId: user.id, username: user.username });
      }
    }

    return {
      conference: {
        text: conference.text,
        creator: {
          userId: creator.id,
          username: creator.username,
        },
        authors,
        reviewers,
      },
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
