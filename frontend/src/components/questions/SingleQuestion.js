import { useParams } from "react-router-dom";
import { getCategoryString, getDateString } from "./utils";
import useFetchData from "../../hooks/useFetchData";
import "./questions.css";
import like from "../../assets/like.png";
import { useEffect, useState } from "react";
import RichTextField from "../forms/RichTextField";
import { isAuthenticated } from "../../auth/auth";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import LoginModal, { showLoginModal } from "../Modals/LoginModal";

export const SingleQuestion = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/questions/${id}`);

  if (isLoading) {
    return null;
  }

  const question = data;
  const {
    created_at,
    updated_at,
    likes,
    author,
    heading,
    description,
    categories,
    answers,
  } = question;

  return (
    <div className="container main-content">
      <LoginModal />
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="welcome-container question-box">
            <div className="row">
              <div className="col-md-6 author">
                {author?.username}{" "}
                <span className="date">asked {getDateString(created_at)}</span>
                {getDateString(created_at) !== getDateString(updated_at) && (
                  <span className="date">
                    , modified {getDateString(updated_at)}
                  </span>
                )}
              </div>
              <div className="col-md-6 categories">
                {getCategoryString(categories)}
              </div>
            </div>
            <p className="question-heading">
              <a href={`/questions/${id}`}>{heading}</a>
            </p>
            {description && (
              <div
                className="question-description"
                style={{ fontSize: "Large" }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            <ContentLikes
              contentType={"question"}
              initialState={likes}
              contentId={id}
            />
          </div>

          <p className="answer-note">
            {answers?.length} {answers?.length === 1 ? "Answer" : "Answers"}
          </p>

          {answers?.length > 0 && (
            <div className="welcome-container question-box">
              {answers.map((answer, index) => {
                return (
                  <>
                    <Answer key={answer.id} answer={answer} />
                    {index !== answers?.length - 1 && (
                      <>
                        <br></br>
                        <hr></hr>
                      </>
                    )}
                  </>
                );
              })}
            </div>
          )}

          <AnswerField questionId={id} />
        </div>
      </div>
    </div>
  );
};

export const ContentLikes = ({ contentType, initialState, contentId }) => {
  const [likes, setLikes] = useState(initialState);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      apiCall.get(`/api/v1/liked_${contentType}s/`).then((response) => {
        const ids = response?.data[`liked_${contentType}s_ids`];
        if (ids.includes(parseInt(contentId))) {
          document
            ?.getElementById(`${contentType}${contentId}`)
            .classList.add("liked-question");
          document
            .getElementById(`${contentType}${contentId}`)
            ?.setAttribute(
              "title",
              `Click one more time to dislike the ${contentType}`
            );
          setIsLiked(true);
        } else {
          document
            ?.getElementById(`${contentType}${contentId}`)
            .classList.remove("liked-question");
          document
            ?.getElementById(`${contentType}${contentId}`)
            .setAttribute(
              "title",
              `Like the ${contentType} to make it more popular`
            );
          setIsLiked(false);
        }
      });
    }
  }, [isLiked, contentId, contentType]);

  const LikeOrDislike = () => {
    if (isAuthenticated()) {
      apiCall
        .post(`/api/v1/${contentType}s/${contentId}/like/`, {})
        .then(() => {
          setLikes((prev) => prev + 1);
          setIsLiked(true);
        })
        .catch((error) => {
          if (!error.response.data["Error"]) {
            console.log("Something went wrong");
          } else {
            apiCall
              .post(`/api/v1/${contentType}s/${contentId}/dislike/`, {})
              .then(() => {
                setLikes((prev) => prev - 1);
                setIsLiked(false);
              });
          }
        });
    } else {
      showLoginModal();
    }
  };

  return (
    <div className="question-footer">
      <div className="question-wrapper">
        <div
          id={`${contentType}${contentId}`}
          className="question-info like-question"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Like the ${contentType} to make it more popular`}
          onClick={LikeOrDislike}
        >
          <div>
            <img src={like} alt="likes" width="25px" height="21px" />
            <span>
              {`Like this ${contentType}`} ({likes})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Answer = ({ answer }) => {
  const { id, created_at, updated_at, likes, author, body } = answer;

  return (
    <>
      <div className="row">
        <div className="col-md-9 author">
          {author?.username}{" "}
          <span className="date">answered {getDateString(created_at)}</span>
          {getDateString(created_at) !== getDateString(updated_at) && (
            <span className="date">, modified {getDateString(updated_at)}</span>
          )}
        </div>
      </div>
      {body && (
        <div
          className="question-description answer-body"
          style={{ fontSize: "Large", border: "none", marginTop: "1.5rem" }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
      <ContentLikes
        contentType={"answer"}
        initialState={likes}
        contentId={id}
      />
    </>
  );
};

export const AnswerField = ({ questionId }) => {
  const [answerContent, setAnswerContent] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ body: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      apiCall
        .post("/api/v1/answers/", {
          question_id: questionId,
          body: answerContent,
        })
        .then(() => {
          setIsSuccess(true);
          setAnswerContent("");
          setErrorMessage({ body: "" });
        })
        .catch((error) => {
          setErrorMessage({ ...error.response.data });
          console.log(error.response.data);
        });
    } else {
      showLoginModal();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="answer-note">Your Answer</p>
        <RichTextField
          descriptionContent={answerContent}
          setDescriptionContent={setAnswerContent}
        />
        {errorMessage?.body && <ErrorMessage message={errorMessage.body} />}
        <button
          className="btn btn-default link-button"
          style={{
            marginTop: "0",
            padding: "10px 30px",
            fontSize: "1.4rem",
          }}
          type="submit"
        >
          Answer
        </button>
        {isSuccess && (
          <p
            className="question-success"
            style={{ textAlign: "center", color: "#964202" }}
          >
            Your answer has been published successfully. To see it, reload the
            page.
          </p>
        )}
      </form>
    </>
  );
};
