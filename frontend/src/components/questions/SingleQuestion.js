import { useParams } from "react-router-dom";
import {
  getCategoryString,
  getCategoryListString,
  getDateString,
} from "./utils";
import useFetchData from "../../hooks/useFetchData";
import "./questions.css";
import like from "../../assets/like.png";
import { useEffect, useState } from "react";
import RichTextField from "../forms/RichTextField";
import { isAuthenticated } from "../../auth/auth";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import LoginModal, { showLoginModal } from "../Modals/LoginModal";
import { Tooltip } from "react-tooltip";
import useFetchUser from "../../hooks/useFetchUser";
import DeleteModal, { showDeleteModal } from "../Modals/DeleteModal";

export const SingleQuestion = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/questions/${id}`);
  const { user, isLoading2 } = useFetchUser();

  if (isLoading || isLoading2) {
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

  const deleteQuestion = (id) => {
    apiCall.delete(`/api/v1/questions/${id}`);
    window.location.href = "/questions";
  };

  return (
    <div className="container main-content">
      <LoginModal />
      <DeleteModal contentType={"question"} modalId={"question-delete-modal"} />
      <DeleteModal contentType={"answer"} modalId={"answer-delete-modal"} />
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
                <span
                  style={{ cursor: "pointer" }}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-html={getCategoryListString(categories)}
                >
                  {getCategoryString(categories)}
                </span>
                <Tooltip id="my-tooltip" place="right" />
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

            {user?.username == author?.username && (
              <EditDelete
                deleteModalId={"question-delete-modal"}
                deleteAction={deleteQuestion}
                contentId={id}
              />
            )}
          </div>

          <p className="answer-note">
            {answers?.length} {answers?.length === 1 ? "Answer" : "Answers"}
          </p>

          {answers?.length > 0 && (
            <div className="welcome-container question-box">
              {answers.map((answer, index) => {
                return (
                  <>
                    <Answer key={answer.id} user={user} answer={answer} />
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
              "data-tooltip-content",
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
              "data-tooltip-content",
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
          data-tooltip-id="like-tooltip"
          data-tooltip-content={`Like the ${contentType} to make it more popular`}
          onClick={LikeOrDislike}
        >
          <div>
            <img src={like} alt="likes" width="25px" height="21px" />
            <span>
              {`Like this ${contentType}`} ({likes})
            </span>
            <Tooltip id="like-tooltip" place="bottom" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditDelete = ({ deleteModalId, deleteAction, contentId }) => {
  return (
    <div className="question-edit-delete">
      <button
        className="btn btn-primary"
        style={{ marginRight: "20px", fontSize: "1.2rem" }}
      >
        Edit
      </button>
      <button
        onClick={() => showDeleteModal(deleteModalId, deleteAction, contentId)}
        className="btn btn-danger"
        style={{ fontSize: "1.2rem" }}
      >
        Delete
      </button>
    </div>
  );
};

export const Answer = ({ user, answer }) => {
  const { id, created_at, updated_at, likes, author, body } = answer;

  const deleteAnswer = (id) => {
    apiCall
      .delete(`/api/v1/answers/${id}`)
      .then(() => document.location.reload());
    console.log(`Answer ${id} deleted`);
  };

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

      {user?.username == author?.username && (
        <EditDelete
          deleteModalId={"answer-delete-modal"}
          deleteAction={deleteAnswer}
          contentId={id}
        />
      )}
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
            className="message-success mt-3"
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
