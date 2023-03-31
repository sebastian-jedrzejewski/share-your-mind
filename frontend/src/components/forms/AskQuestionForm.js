import React, { useState } from "react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import apiCall from "../../api/axios";
import "./forms.css";
import MultiSelect from "./MulitSelect";
import RichTextField from "./RichTextField";

const AskQuestionForm = () => {
  const [headingContent, setHeadingContent] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

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
        // window.location.reload();
        setHeadingContent("");
        setDescriptionContent("");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 welcome-container ask-question-form">
            <div className="ask-header">
              <p>Please fill out the form below to ask a question.</p>
            </div>
            <form className="question-form" onSubmit={handleSubmit}>
              <label htmlFor="heading-content" className="form-title">
                Heading:
              </label>
              <textarea
                id="heading-content"
                className="heading"
                maxLength={200}
                name="headingContent"
                value={headingContent}
                onChange={handleHeadingChange}
              />
              <label className="form-title">Description:</label>
              <RichTextField
                descriptionContent={descriptionContent}
                setDescriptionContent={setDescriptionContent}
              />
              <label className="form-title">Categories:</label>
              <MultiSelect
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
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
