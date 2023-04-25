import { useEffect, useState } from "react";
import MultiSelect from "../forms/MulitSelect";
import useFetchUser from "../../hooks/useFetchUser";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import RichTextField, {
  RichTextFieldWithContent,
} from "../forms/RichTextField";

const EditQuestion = () => {
  const { user, isLoading } = useFetchUser();
  const { id } = useParams();
  const { data } = useFetchData(`/api/v1/questions/${id}`);
  const [questionData, setQuestionData] = useState({
    heading: "",
    description: "",
    categories: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const question = data;

  useEffect(() => {
    let categories = [];
    let name;
    question?.categories.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      return categories.push({
        value: category?.name,
        label: name,
        id: category?.id,
      });
    });

    setQuestionData({
      heading: question?.heading,
      description: question?.description,
      categories: categories,
    });
  }, [question]);

  useEffect(() => {
    console.log(questionData?.description);
  }, [questionData?.description]);

  if (isLoading) {
    return null;
  }

  const setSelectedCategories = (selectedCategories) => {
    setQuestionData({ ...questionData, categories: selectedCategories });
  };

  const setDescriptionContent = (description) => {
    setQuestionData({ ...questionData, description: description });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuestionData({ ...questionData, [name]: value });
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     let categoriesIds = [];
  //     for (let i = 0; i < profileData?.favouriteCategories.length; i++) {
  //       categoriesIds.push({
  //         id: parseInt(profileData?.favouriteCategories[i].id),
  //       });
  //     }

  //     const editData = {
  //       username: profileData?.username,
  //       first_name: profileData?.firstName,
  //       last_name: profileData?.lastName,
  //       favourite_categories: categoriesIds,
  //     };

  //     apiCall
  //       .patch("/auth/users/me/", editData)
  //       .then(() => {
  //         setIsSuccess(true);
  //         setErrorField({
  //           username: "",
  //           favourite_categories: "",
  //         });
  //       })
  //       .catch((error) => {
  //         setErrorField({ ...error.response.data });
  //         setIsSuccess(false);
  //       });
  //   };

  return (
    <div className="container main-content">
      <div className="row">
        <div
          className="col-md-8 offset-md-2 welcome-container"
          style={{ color: "#964202" }}
        >
          <div className="ask-header">
            <p>Edit Your Question</p>
          </div>
          <form className="default-form">
            <label htmlFor="heading" className="form-title">
              <strong>Heading:</strong>
            </label>
            <textarea
              id="heading"
              name="heading"
              className="heading"
              maxLength={200}
              value={questionData?.heading}
              onChange={handleChange}
            />
            {/* {errorField.username && (
              <>
                <ErrorMessage message={errorField.username} />
                <br />
              </>
            )} */}

            <label htmlFor="description" className="form-title">
              <p>Description:</p>
            </label>
            {question?.description === "" ? (
              <RichTextField
                descriptionContent={question?.description}
                setDescriptionContent={setDescriptionContent}
              />
            ) : (
              <RichTextFieldWithContent
                descriptionContent={question?.description}
                setDescriptionContent={setDescriptionContent}
              />
            )}

            <label className="form-title">
              <p>Categories:</p>
            </label>
            <MultiSelect
              selectedCategories={questionData?.categories}
              setSelectedCategories={setSelectedCategories}
            />
            {/* {errorField.favourite_categories && (
              <>
                <ErrorMessage message={errorField.favourite_categories} />
                <br />
              </>
            )} */}

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
                  Your Question has been updated successfully.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
