import { useParams } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./../contexts/UserContext";
import { getUserType } from "../functions/getUserType";
import { Header } from "./Header.jsx";

const fetchArticles = async (conferenceId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/articles/${conferenceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
};

const createArticle = async (conferenceId, text, userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/articles/${conferenceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          userId,
        }),
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to create article");
    }

    const newArticle = await response.json();
    return newArticle;
  } catch (err) {
    console.error("Error creating article:", err);
    return null;
  }
};

const fetchConferenceDetails = async (conferenceId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/conferences/${conferenceId}/details`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch conference details");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching conference details:", err);
    return null;
  }
};

const fetchFeedbacks = async (articleId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/feedbacks/${articleId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch feedbacks");
    }

    const feedbacks = await response.json();
    return feedbacks;
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    return [];
  }
};

const createFeedback = async (articleId, text) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/feedbacks/${articleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create feedback");
    }

    const feedback = await response.json();
    return feedback;
  } catch (err) {
    console.error("Error creating feedback:", err);
    return null;
  }
};

export const Conference = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [newArticleText, setNewArticleText] = useState("");
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      const articles = await fetchArticles(id);

      const articlesWithFeedbacks = await Promise.all(
        articles.map(async (article) => {
          const feedbacks = await fetchFeedbacks(article.id);
          return { ...article, feedbacks };
        })
      );

      setArticles(articlesWithFeedbacks);
      console.log(articlesWithFeedbacks);

      const details = await fetchConferenceDetails(id);
      setConferenceDetails(details);
    };

    load();
  }, [id, refreshToken]);

  const handleAddArticle = async () => {
    if (newArticleText.trim() === "") {
      alert("Article text cannot be empty");
      return;
    }

    const newArticle = await createArticle(id, newArticleText, user.id);
    if (newArticle) {
      setNewArticleText("");
      setRefreshToken(refreshToken + 1);
    } else {
      alert("Failed to create article");
    }
  };

  const handleAddFeedback = async (articleId) => {
    const article = articles.find((a) => a.id === articleId);
    if (
      !article ||
      !article.feedbackText ||
      article.feedbackText.trim() === ""
    ) {
      alert("Feedback text cannot be empty");
      return;
    }

    const newFeedback = await createFeedback(articleId, article.feedbackText);

    if (newFeedback) {
      const updatedFeedbacks = await fetchFeedbacks(articleId);
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.id === articleId
            ? { ...a, feedbacks: updatedFeedbacks, feedbackText: "" }
            : a
        )
      );
    } else {
      alert("Failed to post feedback");
    }
  };

  const isReviewerOfThisConference =
    conferenceDetails &&
    conferenceDetails.conference.reviewers.some(
      (reviewer) => reviewer.userId === user.id
    );

  const isAuthorOfThisConference =
    conferenceDetails &&
    conferenceDetails.conference.authors.some(
      (author) => author.userId === user.id
    );

  const isReviewerOfArticle = (articleId) => {
    return articles
      .filter((article) => article.id === articleId)
      .allowedReviewers.some((reviewer) => reviewer === user.id);
  };

  return (
    <React.Fragment>
      <Header user={user} />

      {conferenceDetails && (
        <React.Fragment>
          <div className="p-4 bg-purple-200 my-4">
            <div className="text-3xl">Conferinţa cu numărul {id}</div>
            <p>
              <strong>Nume:</strong> {conferenceDetails.conference.text}
            </p>
            <p>
              <strong>Creata de:</strong>{" "}
              {conferenceDetails.conference.creator.username}
            </p>
            <p>
              <strong>Autori:</strong>{" "}
              {conferenceDetails.conference.authors
                .map((author) => author.username)
                .join(", ")}
            </p>
            <p>
              <strong>Revieweri:</strong>{" "}
              {conferenceDetails.conference.reviewers
                .map((reviewer) => reviewer.username)
                .join(", ")}
            </p>
          </div>
        </React.Fragment>
      )}

      <div className="p-4 bg-purple-100">
        <div className="flex flex-col space-y-4">
          {articles &&
            articles.length > 0 &&
            articles.map((article) => (
              <div
                key={article.id}
                className="border m-2 p-4 flex flex-col space-y-2 rounded-lg shadow-md bg-purple-200"
              >
                <h2 className="text-xl font-semibold">Articol</h2>
                <h3 className="text-sm text-gray-500">
                  Facut de {article.user.username};
                  Revieweri: {article.reviewerNames}
                </h3>
                <p>{article.text}</p>

                <div className="ml-4 mt-4">
                  <h4 className="text-lg font-semibold text-center">
                    Feedback-uri
                  </h4>
                  <div className="flex flex-col space-y-2">
                    {article.feedbacks && article.feedbacks.length > 0 ? (
                      article.feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="flex justify-center items-start space-x-2"
                        >
                          <div className="max-w-md bg-purple-300 p-2 rounded-lg shadow-md">
                            <p>{feedback.text}</p>
                            <div className="text-sm text-gray-600 mt-2">
                              <strong>
                                feedback lasat de {feedback.user.username}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center">
                        Nu există feedback-uri pentru acest articol.
                      </div>
                    )}
                  </div>
                </div>

                {user &&
                  isReviewerOfArticle &&
                  getUserType(user.type) === "reviewer" &&
                  isReviewerOfThisConference && (
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Spune-ti parerea..."
                        value={article.feedbackText || ""}
                        onChange={(e) => {
                          const updatedArticles = articles.map((a) =>
                            a.id === article.id
                              ? { ...a, feedbackText: e.target.value }
                              : a
                          );
                          setArticles(updatedArticles);
                        }}
                      />
                      <button
                        className="mt-2 px-4 py-2 rounded bg-gray-800 text-white hover:bg-purple-600"
                        onClick={() => handleAddFeedback(article.id)}
                      >
                        Posteaza
                      </button>
                    </div>
                  )}
              </div>
            ))}
          {articles.length === 0 && (
            <div>Nu au fost publicate articole inca!</div>
          )}
        </div>

        {user &&
          getUserType(user.type) === "author" &&
          isAuthorOfThisConference && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Scrie aici articolul tau..."
                value={newArticleText}
                onChange={(e) => setNewArticleText(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 rounded bg-gray-800 text-white hover:bg-purple-600"
                onClick={handleAddArticle}
              >
                Publica
              </button>
            </div>
          )}
      </div>
    </React.Fragment>
  );
};
