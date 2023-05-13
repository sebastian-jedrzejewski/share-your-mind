import { useEffect, useState } from "react";
import MultiSelect from "../forms/MulitSelect";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import RichTextField, {
  RichTextFieldWithContent,
} from "../forms/RichTextField";
import { Tooltip } from "react-tooltip";

const EditBlogPost = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/blog_posts/${id}`);
  const [imageContent, setImageContent] = useState("");
  const [blogPostData, setBlogPostData] = useState({
    title: "",
    content: "",
    categories: "",
  });
  const [errorField, setErrorField] = useState({
    title: "",
    content: "",
    categories_id: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const blogPost = data;

  useEffect(() => {
    let categories = [];
    let name;
    blogPost?.categories.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      return categories.push({
        value: category?.name,
        label: name,
        id: category?.id,
      });
    });

    setBlogPostData({
      title: blogPost?.title,
      content: blogPost?.content,
      categories: categories,
    });
  }, [blogPost]);

  if (isLoading) {
    return null;
  }

  const setSelectedCategories = (selectedCategories) => {
    setBlogPostData({ ...blogPostData, categories: selectedCategories });
  };

  const setContentContent = (content) => {
    setBlogPostData({ ...blogPostData, content: content });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBlogPostData({ ...blogPostData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImageContent(selectedImage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let categoriesIds = [];
    for (let i = 0; i < blogPostData?.categories.length; i++) {
      categoriesIds.push(parseInt(blogPostData?.categories[i].id));
    }

    let form_data = new FormData();
    if (imageContent) {
      form_data.append("image_url", imageContent, imageContent.name);
    }
    form_data.append("title", blogPostData?.title);
    form_data.append("content", blogPostData?.content);
    for (let categoryId of categoriesIds) {
      form_data.append("categories_id", categoryId);
    }

    apiCall
      .patch(`/api/v1/blog_posts/${id}/`, form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setIsSuccess(true);
        setErrorField({
          title: "",
          content: "",
          categories_id: "",
        });
      })
      .catch((error) => {
        setErrorField({ ...error.response.data });
        if (error?.response?.data?.title?.length > 0) {
          document.getElementById("title").style.marginBottom = "0";
        } else {
          document.getElementById("title").style.marginBottom = "1.5rem";
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
    <div className="container main-content">
      <div className="row">
        <div
          className="col-md-8 offset-md-2 welcome-container"
          style={{ color: "#964202" }}
        >
          <div className="ask-header">
            <p>Edit Your Blog Post</p>
          </div>
          <form className="default-form" onSubmit={handleSubmit}>
            {blogPost?.image_url && (
              <>
                <label htmlFor="image" className="form-title">
                  Current title image:
                </label>
                <img
                  id="image"
                  alt=""
                  src={blogPost?.image_url}
                  style={{
                    width: "50%",
                    display: "block",
                    marginBottom: "1.5rem",
                  }}
                />
              </>
            )}
            <label htmlFor="image-content" className="form-title">
              New title image:
            </label>
            <span
              style={{ cursor: "pointer" }}
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Only choosing a new image overrides the old one. If you don't want to change image, leave this field blank."
            >
              <input
                title=""
                id="image-content"
                className="form-control"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
              />
            </span>
            <Tooltip id="my-tooltip" place="bottom" />
            <label htmlFor="title" className="form-title">
              <strong>Title:</strong>
            </label>
            <input
              id="title"
              className="form-control"
              name="title"
              type="text"
              maxLength="150"
              value={blogPostData?.title}
              onChange={handleChange}
            />
            {errorField.title && (
              <>
                <ErrorMessage message={errorField.title} />
                <br />
              </>
            )}

            <label htmlFor="content" className="form-title">
              <p>
                <strong>Content:</strong>
              </p>
            </label>
            {blogPost?.content === "" ? (
              <RichTextField
                descriptionContent={blogPost?.content}
                setDescriptionContent={setContentContent}
              />
            ) : (
              <RichTextFieldWithContent
                descriptionContent={blogPost?.content}
                setDescriptionContent={setContentContent}
              />
            )}

            <label className="form-title">
              <p>
                <strong>Categories:</strong>
              </p>
            </label>
            <MultiSelect
              selectedCategories={blogPostData?.categories}
              setSelectedCategories={setSelectedCategories}
            />
            {errorField.categories_id && (
              <>
                <ErrorMessage message={errorField.categories_id} />
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
                  Your Blog Post has been updated successfully. Back to
                  <a href={`/blog-posts/${id}`}> your Blog Post.</a>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPost;
