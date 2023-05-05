import { useEffect, useState } from "react";
import MultiSelect from "../forms/MulitSelect";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";

import "../forms/forms.css";

import plus from "../../assets/plus.png";
import deleteBtn from "../../assets/delete.png";
import { Tooltip } from "react-tooltip";

const EditPoll = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/polls/${id}`);
  const [pollData, setPollData] = useState({
    heading: "",
    categories: "",
  });
  const [pollAnswersContent, setPollAnswersContent] = useState([]);
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const [errorField, setErrorField] = useState({
    heading: "",
    categories_id: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const poll = data;

  useEffect(() => {
    let categories = [];
    let name;
    poll?.categories.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      return categories.push({
        value: category?.name,
        label: name,
        id: category?.id,
      });
    });

    let answers = [];
    for (let i = 0; i < poll?.answers.length; i++) {
      answers.push({ heading: poll?.answers[i]?.heading });
    }

    setPollData({
      heading: poll?.heading,
      categories: categories,
      answers: answers,
    });
    setPollAnswersContent(answers);
    setNumberOfAnswers(answers?.length);
  }, [poll]);

  if (isLoading) {
    return null;
  }

  const setSelectedCategories = (selectedCategories) => {
    setPollData({ ...pollData, categories: selectedCategories });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPollData({ ...pollData, [name]: value });
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
    for (let i = 0; i < pollData?.categories.length; i++) {
      categoriesIds.push(parseInt(pollData?.categories[i].id));
    }

    const editData = {
      heading: pollData?.heading,
      categories_id: categoriesIds,
    };

    let newAnswers = [];
    for (
      let i = pollData?.answers?.length;
      i <
      pollData?.answers?.length +
        (pollAnswersContent?.length - pollData?.answers?.length);
      i++
    ) {
      newAnswers.push({ poll_id: id, heading: pollAnswersContent[i]?.heading });
    }

    let emptyAnswers = 0;
    for (let i = 0; i < newAnswers.length; i++) {
      if (newAnswers[i]?.heading === "") {
        emptyAnswers++;
      }
    }

    if (emptyAnswers > 0) {
      setErrorField({
        ...errorField,
        emptyAnswers: "Poll cannot contain empty answers.",
      });
      return;
    }

    for (let i = 0; i < newAnswers.length; i++) {
      apiCall
        .post(`/api/v1/poll_answers/`, newAnswers[i])
        .then(() => {
          setIsSuccess(true);
          setErrorField({
            heading: "",
            categories_id: "",
          });
        })
        .catch((error) => {
          setErrorField({ ...error.response.data });
          setIsSuccess(false);
          return;
        });
    }

    apiCall
      .patch(`/api/v1/polls/${id}/`, editData)
      .then(() => {
        setIsSuccess(true);
        setErrorField({
          heading: "",
          categories_id: "",
        });
      })
      .catch((error) => {
        setErrorField({ ...error.response.data });
        setIsSuccess(false);
      });
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

  return (
    <div className="container main-content">
      <div className="row">
        <div
          className="col-md-8 offset-md-2 welcome-container"
          style={{ color: "#964202" }}
        >
          <div className="ask-header">
            <p>Edit Your Poll</p>
          </div>
          <form className="default-form" onSubmit={handleSubmit}>
            <label htmlFor="heading" className="form-title">
              <strong>Heading:</strong>
            </label>
            <textarea
              id="heading"
              name="heading"
              className="heading"
              maxLength={200}
              value={pollData?.heading}
              onChange={handleChange}
            />
            {errorField.heading && (
              <>
                <ErrorMessage message={errorField.heading} />
                <br />
              </>
            )}

            <label className="form-title">
              <p>Categories:</p>
            </label>
            <MultiSelect
              selectedCategories={pollData?.categories}
              setSelectedCategories={setSelectedCategories}
            />
            {errorField.categories_id && (
              <>
                <ErrorMessage message={errorField.categories_id} />
                <br />
              </>
            )}

            <div className="poll-answers" style={{ marginTop: "1.5rem" }}>
              {pollData?.answers?.map((answer, index) => {
                return (
                  <div
                    className="add-answer-form"
                    id={`poll-answer${index + 1}`}
                  >
                    <input
                      className="form-control"
                      type="text"
                      maxLength="100"
                      placeholder="Heading"
                      value={answer?.heading}
                      disabled
                    />
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Cannot delete already created answer"
                    >
                      <img src={deleteBtn} width="30" height="30" />
                    </span>
                    <Tooltip id="my-tooltip" place="right" />
                  </div>
                );
              })}
            </div>

            <div className="add-answer">
              <div
                className="add-answer-icon"
                onClick={() => {
                  addAnswerForm();
                }}
              >
                <span>
                  <img src={plus} width="25" height="25" />
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
            {errorField.emptyAnswers && (
              <>
                <ErrorMessage message={errorField.emptyAnswers} />
                <br />
              </>
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
                Save changes
              </button>
              {isSuccess && (
                <p className="message-success text-center mt-3">
                  Your Poll has been updated successfully. Back to
                  <a href={`/polls/${id}`}> your Poll.</a>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPoll;
