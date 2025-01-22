import express from "express";
import {
  getAllConferences,
  createConference,
  getConferenceDetailsById,
} from "../dataAccess/conferenceDa.js";
import { authenticateToken } from "../middleware.js";
import { addReviewersToConference } from "../dataAccess/conferenceReviewerDa.js";
import { addAuthorsToConference } from "../dataAccess/conferenceAuthorDa.js";
import { ConferenceReviewer } from "../entities/conference_reviewers.js";
import { ConferenceAuthor } from "../entities/conference_authors.js";
import { User } from "../entities/user.js";

const conferenceRouter = express.Router();

conferenceRouter.get("/all", authenticateToken, async (req, res) => {
  try {
    const conferences = await getAllConferences();
    res.status(200).json(conferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

conferenceRouter.post("/create", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const { id: userId } = req.user;
    const newConference = await createConference({ userId, text });
    res.status(201).json({
      message: "Conference created successfully",
      conference: newConference,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

conferenceRouter.post("/addReviewers", authenticateToken, async (req, res) => {
  try {
    const { conferenceId, reviewerIds } = req.body;

    const uniqueReviewerIds = [...new Set(reviewerIds)];
    if (uniqueReviewerIds.length !== reviewerIds.length) {
      return res
        .status(400)
        .json({ message: "Duplicate reviewers are not allowed." });
    }

    const updatedConference = await addReviewersToConference(
      conferenceId,
      reviewerIds
    );
    res.status(200).json({
      message: "Reviewers added successfully",
      conference: updatedConference,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

conferenceRouter.get("/reviewers", authenticateToken, async (req, res) => {
  try {
    const conferenceReviewers = await ConferenceReviewer.findAll();

    if (conferenceReviewers.length === 0) {
      return res.status(404).json({ message: "No reviewers found." });
    }

    const reviewerList = [];

    for (const reviewer of conferenceReviewers) {
      const user = await User.findByPk(reviewer.reviewerId, {
        attributes: ["id", "username"],
      });

      if (user) {
        reviewerList.push({
          conferenceId: reviewer.conferenceId,
          userId: user.id,
          username: user.username,
        });
      }
    }

    res.status(200).json(reviewerList);
  } catch (err) {
    console.error("Error fetching reviewers:", err);
    res.status(500).json({ message: err.message });
  }
});

conferenceRouter.post("/addAuthors", authenticateToken, async (req, res) => {
  try {
    const { conferenceId, authorIds } = req.body;

    if (!Array.isArray(authorIds) || authorIds.length !== 1) {
      return res.status(400).json({ message: "Invalid author data" });
    }

    const uniqueAuthorIds = [...new Set(authorIds)];

    const updatedConference = await addAuthorsToConference(
      conferenceId,
      uniqueAuthorIds
    );

    res.status(200).json({
      message: "Authors added successfully",
      conference: updatedConference,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

conferenceRouter.get("/authors", authenticateToken, async (req, res) => {
  try {
    const conferenceAuthors = await ConferenceAuthor.findAll();

    const authorList = [];

    for (const author of conferenceAuthors) {
      const user = await User.findByPk(author.authorId, {
        attributes: ["id", "username"],
      });

      if (user) {
        authorList.push({
          conferenceId: author.conferenceId,
          userId: user.id,
          username: user.username,
        });
      }
    }

    res.status(200).json(authorList);
  } catch (err) {
    console.error("Error fetching authors:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching authors." });
  }
});

conferenceRouter.get(
  "/:conferenceId/details",
  authenticateToken,
  async (req, res) => {
    try {
      const { conferenceId } = req.params;
      const result = await getConferenceDetailsById(conferenceId);

      if (result.error) {
        return res.status(404).json({ message: result.error });
      }

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
);

export default conferenceRouter;
