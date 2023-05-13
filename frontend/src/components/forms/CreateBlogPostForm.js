import React, { useState } from "react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import apiCall from "../../api/axios";
import { ErrorMessage } from "./FormControls";
import "./forms.css";
import MultiSelect from "./MulitSelect";
import RichTextField from "./RichTextField";

const CreateBlogPostForm = () => {
  const [imageContent, setImageContent] = useState("");
  const [titleContent, setTitleContent] = useState("");
  const [contentContent, setContentContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    content: "",
    categories_id: "",
  });

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitleContent(value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImageContent(selectedImage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let categoriesIds = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      categoriesIds.push(selectedCategories[i]?.id);
    }

    let form_data = new FormData();
    if (imageContent) {
      form_data.append("image_url", imageContent, imageContent.name);
    }
    form_data.append("title", titleContent);
    form_data.append("content", contentContent);
    for (let categoryId of categoriesIds) {
      form_data.append("categories_id", categoryId);
    }

    apiCall
      .post("/api/v1/blog_posts/", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setIsSuccess(true);
        document.getElementById("image-content").value = "";
        setTitleContent("");
        setContentContent("");
        setSelectedCategories([]);
        setErrorMessage({ title: "", content: "", categories_id: "" });
      })
      .catch((error) => {
        setErrorMessage({ ...error.response.data });
        if (error?.response?.data?.title?.length > 0) {
          document.getElementById("title-content").style.marginBottom = "0";
        } else {
          document.getElementById("title-content").style.marginBottom =
            "1.5rem";
        }
        if (error?.response?.data?.content?.length > 0) {
          document.getElementsByClassName(
            "wrapper-class"
          )[0].style.marginBottom = "0";
        } else {
          document.getElementsByClassName(
            "wrapper-class"
          )[0].style.marginBottom = "1.5rem";
        }
        setIsSuccess(false);
      });
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
              <p>Please fill out the form below to create a blog post.</p>
            </div>
            <form className="default-form" onSubmit={handleSubmit}>
              <label htmlFor="image-content" className="form-title">
                Title image:
              </label>
              <input
                id="image-content"
                className="form-control"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
              />
              <label htmlFor="title-content" className="form-title">
                <strong>Title:</strong>
              </label>
              <input
                id="title-content"
                className="form-control"
                type="text"
                maxLength="150"
                value={titleContent}
                onChange={handleTitleChange}
              />
              {errorMessage.title && (
                <ErrorMessage message={errorMessage.title} />
              )}
              <label className="form-title">
                <strong>Content:</strong>
              </label>
              <RichTextField
                descriptionContent={contentContent}
                setDescriptionContent={setContentContent}
              />
              {errorMessage.content && (
                <ErrorMessage message={errorMessage.content} />
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
              <div className="submit-wrapper">
                <button
                  className="btn btn-default link-button"
                  style={{ marginTop: "2rem", padding: "10px 30px" }}
                  type="submit"
                  id="ask-question-submit"
                >
                  Create Blog Post
                </button>
                {isSuccess && (
                  <p className="message-success text-center mt-3">
                    Your post has been published successfully. We wish you
                    positive feedback from other users. Back to{" "}
                    <a href="/blog-posts">Blog Posts Section.</a>
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

export default CreateBlogPostForm;
