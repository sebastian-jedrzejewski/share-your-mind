import React, { useState } from "react";
import { useEffect } from "react";

import plus from "../../assets/plus.png";
import deleteBtn from "../../assets/delete.png";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import apiCall from "../../api/axios";
import { ErrorMessage } from "./FormControls";
import "./forms.css";
import MultiSelect from "./MulitSelect";

const CreatePollForm = () => {
  const [headingContent, setHeadingContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [pollAnswersContent, setPollAnswersContent] = useState([
    { heading: "" },
    { heading: "" },
  ]);
  const [numberOfAnswers, setNumberOfAnswers] = useState(2);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    heading: "",
    categories_id: "",
    answers_count: "",
  });

  useEffect(() => {
    const answerForms = document.getElementsByClassName("add-answer-form");
    if (answerForms) {
      for (let i = 0; i < answerForms.length; i++) {
        answerForms[i].querySelector("input").value =
          pollAnswersContent[i]?.heading;
      }
    }
  }, [pollAnswersContent]);

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    setHeadingContent(value);
  };

  const handlePollAnswerChange = (e) => {
    const id = e?.target?.parentElement?.id;
    const pollAnswerId = id.charAt(id.length - 1);
    const index = parseInt(pollAnswerId) - 1;
    setPollAnswersContent((prevArray) => [
      ...prevArray.slice(0, index),
      { heading: e?.target?.value },
      ...prevArray.slice(index + 1),
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let categoriesIds = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      categoriesIds.push(selectedCategories[i]?.id);
    }

    const pollContent = {
      heading: headingContent,
      categories_id: categoriesIds,
      answers: pollAnswersContent,
    };

    let nonEmptyAnswers = 0;
    for (let i = 0; i < pollContent.answers.length; i++) {
      if (pollContent.answers[i]?.heading !== "") {
        nonEmptyAnswers++;
      }
    }

    if (nonEmptyAnswers < 2) {
      setErrorMessage({
        ...errorMessage,
        answers_count: "Poll must have at least 2 answers.",
      });
      return;
    }

    if (nonEmptyAnswers < pollContent.answers.length) {
      setErrorMessage({
        ...errorMessage,
        answers_count: "Poll cannot contain empty answers.",
      });
      return;
    }

    apiCall
      .post("/api/v1/polls/create_with_answers/", pollContent)
      .then(() => {
        setIsSuccess(true);
        setHeadingContent("");

        setPollAnswersContent((prevArray) =>
          prevArray.map((obj) => ({ ...obj, heading: "" }))
        );
        setSelectedCategories([]);
        setErrorMessage({ heading: "", categories_id: "" });
      })
      .catch((error) => {
        setErrorMessage({ ...error.response.data });
        if (error?.response?.data?.heading?.length > 0) {
          document.getElementById("poll-heading-content").style.marginBottom =
            "0";
        } else {
          document.getElementById("poll-heading-content").style.marginBottom =
            "1.5rem";
        }
        setIsSuccess(false);
      });
  };

  const deleteAnswerForm = (e) => {
    const id = e?.target?.parentElement?.parentElement?.id;
    const pollAnswerId = id.charAt(id.length - 1);
    const index = parseInt(pollAnswerId) - 1;
    setPollAnswersContent((prevArray) => prevArray.toSpliced(index, 1));

    e?.target?.parentElement?.parentElement.remove();
    const answerForms = document.getElementsByClassName("add-answer-form");
    for (let i = index; i < answerForms.length; i++) {
      answerForms[i].id = `poll-answer${i + 1}`;
    }

    setNumberOfAnswers((current) => current - 1);
  };

  const addAnswerForm = () => {
    const pollAnswers = document.getElementsByClassName("poll-answers")[0];
    if (pollAnswers) {
      let pollAnswerForm = document.createElement("div");
      pollAnswerForm.className = "add-answer-form";
      pollAnswerForm.id = `poll-answer${numberOfAnswers + 1}`;

      let pollAnswer = document.createElement("input");
      pollAnswer.className = "form-control";
      pollAnswer.type = "text";
      pollAnswer.maxLength = "100";
      pollAnswer.placeholder = "Heading";
      setPollAnswersContent((prevArray) => [...prevArray, { heading: "" }]);
      pollAnswer.addEventListener("input", (event) => {
        handlePollAnswerChange(event);
      });
      pollAnswerForm.appendChild(pollAnswer);

      let span = document.createElement("span");
      span.onclick = deleteAnswerForm;
      let deleteButton = document.createElement("img");
      deleteButton.src = deleteBtn;
      deleteButton.width = "30";
      deleteButton.height = "30";
      span.appendChild(deleteButton);
      pollAnswerForm.appendChild(span);

      pollAnswers.appendChild(pollAnswerForm);
      setNumberOfAnswers((current) => current + 1);
    }
  };

  return (
    <>
      <div className="container main-content">
        <div className="row">
          <div
            className="col-md-8 offset-md-2 welcome-container"
            style={{ color: "#964202" }}
          >
            <div className="ask-header">
              <p>Please fill out the form below to create a poll.</p>
            </div>
            <form className="default-form" onSubmit={handleSubmit}>
              <label htmlFor="poll-heading-content" className="form-title">
                <strong>Heading:</strong>
              </label>
              <textarea
                id="poll-heading-content"
                className="heading"
                maxLength={200}
                name="headingContent"
                value={headingContent}
                onChange={handleHeadingChange}
              />
              {errorMessage.heading && (
                <ErrorMessage message={errorMessage.heading} />
              )}
              <label className="form-title">
                <strong>Categories:</strong>
              </label>
              <MultiSelect
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
              {errorMessage.categories_id && (
                <ErrorMessage message={errorMessage.categories_id} />
              )}
              <label className="form-title" style={{ marginTop: "1.5rem" }}>
                <strong>Poll answers:</strong>
              </label>
              <div className="poll-answers">
                <div className="add-answer-form" id="poll-answer1">
                  <input
                    className="form-control"
                    type="text"
                    maxLength="100"
                    placeholder="Heading"
                    onChange={handlePollAnswerChange}
                  />
                  <span onClick={deleteAnswerForm}>
                    <img
                      src={deleteBtn}
                      width="30"
                      height="30"
                      alt="delete-button"
                    />
                  </span>
                </div>
                <div className="add-answer-form" id="poll-answer2">
                  <input
                    className="form-control"
                    type="text"
                    maxLength="100"
                    placeholder="Heading"
                    onChange={handlePollAnswerChange}
                  />
                  <span onClick={deleteAnswerForm}>
                    <img
                      src={deleteBtn}
                      width="30"
                      height="30"
                      alt="delete-button"
                    />
                  </span>
                </div>
              </div>
              <div className="add-answer">
                <div
                  className="add-answer-icon"
                  onClick={() => {
                    addAnswerForm();
                  }}
                >
                  <span>
                    <img src={plus} width="25" height="25" alt="plus" />
                  </span>
                </div>
                <div
                  className="add-answer-text"
                  onClick={() => {
                    addAnswerForm();
                  }}
                >
                  <span>Add another Poll answer</span>
                </div>
              </div>
              {errorMessage.answers_count && (
                <ErrorMessage message={errorMessage.answers_count} />
              )}
              <div className="submit-wrapper">
                <button
                  className="btn btn-default link-button"
                  style={{
                    marginTop: "2rem",
                    padding: "10px 30px",
                    fontSize: "1.4rem",
                  }}
                  type="submit"
                >
                  Create Poll
                </button>
                {isSuccess && (
                  <p className="message-success text-center mt-3">
                    Your poll has been published successfully. We wish you a lot
                    of inspiring votes. Back to{" "}
                    <a href="/polls">Polls Section.</a>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePollForm;
