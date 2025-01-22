import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./../contexts/UserContext";
import { Header } from "./Header";
import { getUserType } from "../functions/getUserType";
import { useNavigate } from "react-router-dom";

export const Conferences = () => {
  const { user } = useContext(UserContext);
  const [conferences, setConferences] = useState([]);
  const [showTextbox, setShowTextbox] = useState(false);
  const [conferenceName, setConferenceName] = useState("");
  const [users, setUsers] = useState([]);
  const [reviewers, setReviewers] = useState({}); // conference id - List<reviewers id >
  const [authors, setAuthors] = useState({}); // conference id - List<authors id >
  const [refreshToken, setRefreshToken] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/conferences/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setConferences(data);
      } catch (err) {
        console.error("Error fetching conferences:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/user/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsers(data.filter((user) => getUserType(user.type) === "reviewer"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchReviewers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/conferences/reviewers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        const reviewersByConference = data.reduce(
          (acc, { conferenceId, userId, username }) => {
            if (!acc[conferenceId]) {
              acc[conferenceId] = [];
            }
            acc[conferenceId].push({ userId, username });
            return acc;
          },
          {}
        );

        setReviewers(reviewersByConference);
      } catch (err) {
        console.error("Error fetching reviewers:", err);
      }
    };

    const fetchAuthors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/conferences/authors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        const authorsByConference = data.reduce(
          (acc, { conferenceId, userId, username }) => {
            if (!acc[conferenceId]) {
              acc[conferenceId] = [];
            }
            acc[conferenceId].push({ userId, username });
            return acc;
          },
          {}
        );

        setAuthors(authorsByConference);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    fetchConferences();
    fetchUsers();
    fetchReviewers();
    fetchAuthors();
  }, [refreshToken]);

  const handleCreateConference = async () => {
    if (!conferenceName.trim()) {
      alert("Conference name cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3001/api/conferences/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: conferenceName }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setConferences((prev) => [...prev, data.conference]);
        setConferenceName("");
        setShowTextbox(false);
      } else {
        alert(data.message || "Error creating conference");
      }
    } catch (err) {
      console.error("Error creating conference:", err);
    }
  };

  const handleAddReviewer = (conferenceId) => {
    setReviewers((prev) => ({
      ...prev,
      [conferenceId]:
        prev[conferenceId] && prev[conferenceId].length > 0
          ? [...prev[conferenceId], ""]
          : ["", ""],
    }));
  };

  const handleReviewerChange = (conferenceId, index, reviewerId) => {
    setReviewers((prev) => {
      const updatedReviewers = [...(prev[conferenceId] || [])];
      updatedReviewers[index] = reviewerId;
      return { ...prev, [conferenceId]: updatedReviewers };
    });
  };

  const handleSaveReviewers = async (conferenceId) => {
    const selectedReviewers = reviewers[conferenceId];
    if (selectedReviewers.length >= 2 && !selectedReviewers.includes("")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/conferences/addReviewers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              conferenceId,
              reviewerIds: selectedReviewers,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Reviewers added successfully.");
        } else {
          alert(data.message || "Error adding reviewers.");
        }
      } catch (err) {
        console.error("Error saving reviewers:", err);
      }
    } else {
      alert("Please select at least 2 reviewers.");
    }
  };

  const handleRegisterAuthor = async (conferenceId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = user.id;

      const response = await fetch(
        "http://localhost:3001/api/conferences/addAuthors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conferenceId,
            authorIds: [userId],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("You have been registered as an author.");
        setRefreshToken(refreshToken + 1);
      } else {
        alert(data.message || "Error registering as an author.");
      }
    } catch (err) {
      console.error("Error registering as an author:", err);
    }
  };

  const isModificaButtonDisabled = (conferenceId) => {
    const selectedReviewers = reviewers[conferenceId] || [];
    return selectedReviewers.some((reviewerId) => reviewerId === "");
  };

  const isInvalidConference = (conferenceId) => {
    const selectedReviewers = reviewers[conferenceId] || [];
    return (
      selectedReviewers.length < 2 || isModificaButtonDisabled(conferenceId)
    );
  };

  const goToConference = (conferenceId) => {
    navigate(`/${conferenceId}`);
  };

  const mappedConferences =
    user && getUserType(user.type) === "organizator"
      ? conferences
      : conferences.filter((conf) => !isInvalidConference(conf.id));

  return (
    <React.Fragment>
      <Header user={user} />
      <div className="flex bg-gray-200 p-4 my-4">
        <div className="text-3xl mx-8">Conferinte</div>
        {user && getUserType(user.type) === "organizator" && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTextbox((prev) => !prev)}
              className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-purple-600"
            >
              +
            </button>
            {showTextbox && (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={conferenceName}
                  onChange={(e) => setConferenceName(e.target.value)}
                  placeholder="Nume conferinta"
                  className="p-2 border rounded"
                />
                <button
                  onClick={handleCreateConference}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-8 gap-4 mt-6">
        {mappedConferences.map((conf) => (
          <div
            key={conf.id}
            className="p-4 rounded shadow bg-white border flex flex-col items-center"
          >
            {(user && getUserType(user.type) === "organizator") ||
              (!isInvalidConference(conf.id) && <div></div>)}
            <div className="text-lg font-bold">Conferinţă</div>
            <div className="text-md">{conf.text}</div>
            <div className="text-sm text-gray-500">Creată de {conf.user}</div>

            {user && getUserType(user.type) === "organizator" && (
              <div className="mt-4">
                <button
                  onClick={() => handleAddReviewer(conf.id)}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Adauga Reviewer
                </button>

                {reviewers[conf.id] &&
                  reviewers[conf.id].map((reviewer, index) => (
                    <div key={index} className="mt-2 flex items-center gap-4">
                      <select
                        value={reviewer.userId}
                        onChange={(e) =>
                          handleReviewerChange(conf.id, index, e.target.value)
                        }
                        className="p-2 border rounded"
                      >
                        <option value="">Select Reviewer</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                <button
                  onClick={() => handleSaveReviewers(conf.id)}
                  disabled={isInvalidConference(conf.id)}
                  className={`mt-4 px-4 py-2 rounded ${
                    isInvalidConference(conf.id)
                      ? "bg-gray-400"
                      : "bg-green-500"
                  } text-white hover:bg-green-600`}
                >
                  Modifica
                </button>

                {isInvalidConference(conf.id) && (
                  <div className="text-red-500 font-bold">
                    Conferinţa este invalidă deoarece nu are minim 2 revieweri
                    sau are revieweri neselectaţi. Pentru ceilalţi utilizatori
                    se afişează ultima variantă validă a conferinţei (sau nimic
                    dacă de abia a fost creată)
                  </div>
                )}
              </div>
            )}

            {user &&
              getUserType(user.type) !== "organizator" &&
              reviewers[conf.id] && (
                <div className="mt-4">
                  <div className="font-bold">Revieweri:</div>
                  <div className="text-sm">
                    {reviewers[conf.id]
                      .map((reviewer) => reviewer.username)
                      .join(", ")}
                  </div>
                </div>
              )}

            <div className="mt-4 text-center">
              <div className="font-bold">Autori:</div>
              <div className="text-sm">
                {authors[conf.id]
                  ? authors[conf.id].map((author) => author.username).join(", ")
                  : "Nu s-au inregistrat autori inca!"}
              </div>
            </div>

            {user &&
              getUserType(user.type) === "author" &&
              (!authors[conf.id] ||
                !authors[conf.id].some(
                  (author) => author.userId === user.id
                )) && (
                <button
                  onClick={() => handleRegisterAuthor(conf.id)}
                  className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Register ca autor
                </button>
              )}

            {!isInvalidConference(conf.id) && (
              <div className="mt-4 text-center">
                <button
                  className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-purple-600"
                  onClick={() => goToConference(conf.id)}
                >
                  Spre conferinţă
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
