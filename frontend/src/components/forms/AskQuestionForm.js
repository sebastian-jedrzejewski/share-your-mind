import React, { useState } from "react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import apiCall from "../../api/axios";
import { ErrorMessage } from "./FormControls";
import "./forms.css";
import MultiSelect from "./MulitSelect";
import RichTextField from "./RichTextField";

const AskQuestionForm = () => {
  const [headingContent, setHeadingContent] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    heading: "",
    categories_id: "",
  });

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    setHeadingContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let categoriesIds = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      categoriesIds.push(selectedCategories[i]?.id);
    }

    const questionContent = {
      heading: headingContent,
      description: descriptionContent,
      categories_id: categoriesIds,
    };
    apiCall
      .post("/api/v1/questions/", questionContent)
      .then(() => {
        setIsSuccess(true);
        setHeadingContent("");
        setDescriptionContent("");
        setSelectedCategories([]);
        setErrorMessage({ heading: "", categories_id: "" });
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage({ ...error.response.data });
        if (error?.response?.data?.heading?.length > 0) {
          document.getElementById("heading-content").style.marginBottom = "0";
        } else {
          document.getElementById("heading-content").style.marginBottom =
            "1.5rem";
        }
        setIsSuccess(false);
      });
  };

  return (
    <>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 offset-md-2 welcome-container ask-question-form">
            <div className="ask-header">
              <p>Please fill out the form below to ask a question.</p>
            </div>
            <form className="question-form" onSubmit={handleSubmit}>
              <label htmlFor="heading-content" className="form-title">
                <strong>Heading:</strong>
              </label>
              <textarea
                id="heading-content"
                className="heading"
                maxLength={200}
                name="headingContent"
                value={headingContent}
                onChange={handleHeadingChange}
              />
              {errorMessage.heading && (
                <ErrorMessage message={errorMessage.heading} />
              )}
              <label className="form-title">Description:</label>
              <RichTextField
                descriptionContent={descriptionContent}
                setDescriptionContent={setDescriptionContent}
              />
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
              <div className="submit-wrapper">
                <button
                  className="btn btn-default link-button"
                  style={{ marginTop: "2rem", padding: "10px 30px" }}
                  type="submit"
                  id="ask-question-submit"
                >
                  Ask Question
                </button>
                {isSuccess && (
                  <p className="question-success">
                    Your question has been published successfully. We wish you a
                    lot of good answers. Back to{" "}
                    <a href="/questions">Questions Section.</a>
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

export default AskQuestionForm;
