import { useParams } from "react-router-dom";
import {
  getCategoryString,
  getCategoryListString,
  getDateString,
} from "../questions/utils";
import useFetchData from "../../hooks/useFetchData";
import like from "../../assets/like.png";
import { useEffect, useState } from "react";
import RichTextField, {
  RichTextFieldWithContent,
} from "../forms/RichTextField";
import { isAuthenticated } from "../../auth/auth";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import LoginModal, { showLoginModal } from "../modals/LoginModal";
import { Tooltip } from "react-tooltip";
import useFetchUser from "../../hooks/useFetchUser";
import DeleteModal, { showDeleteModal } from "../modals/DeleteModal";
import { ContentLikes } from "../questions/SingleQuestion";
import { Poll } from "./Polls";

export const SinglePoll = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/polls/${id}/`);
  const { data: votedAnswers } = useFetchData("/api/v1/voted_poll_answers/");
  const { user } = useFetchUser();

  const [commentState, setCommentState] = useState({
    initialCommentContent: "",
    commentContent: "",
    isCommentModified: false,
    commentId: "",
  });

  if (isLoading) {
    return null;
  }

  const poll = data;
  const {
    created_at,
    updated_at,
    votes,
    author,
    heading,
    categories,
    answers,
    comments,
  } = poll;

  //   const deleteQuestion = (id) => {
  //     apiCall.delete(`/api/v1/questions/${id}`);
  //     window.location.href = "/questions";
  //   };

  return (
    <div className="container main-content">
      <LoginModal />
      {/* <DeleteModal contentType={"question"} modalId={"question-delete-modal"} /> */}
      {/* <DeleteModal contentType={"answer"} modalId={"answer-delete-modal"} /> */}
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <Poll
            poll={poll}
            votedAnswers={votedAnswers}
            commentsBarNeeded={false}
          />
          {/* {user?.username === author?.username && (
              <EditDelete
                deleteModalId={"question-delete-modal"}
                deleteAction={deleteQuestion}
                contentId={id}
              />
            )} */}

          <p className="answer-note">
            {comments?.length} {comments?.length === 1 ? "Comment" : "Comments"}
          </p>

          {comments?.length > 0 && (
            <div className="welcome-container question-box">
              {comments.map((comment, index) => {
                return (
                  <>
                    <Comment
                      key={comment.id}
                      user={user}
                      comment={comment}
                      commentState={commentState}
                      setCommentState={setCommentState}
                    />
                    {index !== comments?.length - 1 && (
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

          <CommentField
            pollId={id}
            commentState={commentState}
            setCommentState={setCommentState}
          />
        </div>
      </div>
    </div>
  );
};

export const Comment = ({ user, comment, commentState, setCommentState }) => {
  const { id, created_at, updated_at, likes, author, body } = comment;

  //   const deleteAnswer = (id) => {
  //     apiCall
  //       .delete(`/api/v1/answers/${id}`)
  //       .then(() => document.location.reload());
  //   };

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
        contentType={"poll_comment"}
        contentText={"comment"}
        initialState={likes}
        contentId={id}
      />

      {/* {user?.username === author?.username && (
        <EditDelete
          deleteModalId={"answer-delete-modal"}
          deleteAction={deleteAnswer}
          contentId={id}
          answerState={answerState}
          setAnswerState={setAnswerState}
        />
      )} */}
    </>
  );
};

export const CommentField = ({ pollId, commentState, setCommentState }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ body: "" });

  // useEffect(() => {
  //   if (answerState?.isAnswerModified === false) {
  //     document.getElementById("answer-to-question").innerHTML = "Answer";
  //   }
  // }, [answerState?.isAnswerModified]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      // if (!answerState?.isAnswerModified) {
      apiCall
        .post("/api/v1/poll_comments/", {
          poll_id: pollId,
          body: commentState?.commentContent,
        })
        .then(() => {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
          setCommentContent("");
          setErrorMessage({ body: "" });
          setCommentState({
            ...commentState,
            isCommentModified: false,
            initialCommentContent: "<p></p>",
          });
        })
        .catch((error) => {
          setErrorMessage({ ...error.response.data });
          console.log(error.response.data);
        });
      // } else {
      //   apiCall
      //     .patch(`/api/v1/answers/${answerState?.answerId}/`, {
      //       body: answerState?.answerContent,
      //     })
      //     .then(() => {
      //       setIsSuccess(true);
      //       setTimeout(() => {
      //         setIsSuccess(false);
      //       }, 3000);
      //       setAnswerContent("");
      //       setErrorMessage({ body: "" });
      //       setAnswerState({
      //         ...answerState,
      //         isAnswerModified: false,
      //         initialAnswerContent: "",
      //       });
      //     })
      //     .catch((error) => {
      //       setErrorMessage({ ...error.response.data });
      //       console.log(error.response.data);
      //     });
      // }
      //   document.getElementById("cancel-editing").style.display = "none";
    } else {
      showLoginModal();
    }
  };

  const setCommentContent = (commentContent) => {
    setCommentState({ ...commentState, commentContent: commentContent });
  };

  //   const cancelEditing = (e) => {
  //     setAnswerState({
  //       ...answerState,
  //       isAnswerModified: false,
  //       initialAnswerContent: "",
  //     });
  //     e.target.style.display = "none";
  //   };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="answer-note" id="your-answer">
          Your Comment
        </p>
        {commentState?.initialCommentContent === "" ? (
          <RichTextField
            descriptionContent={commentState?.initialCommentContent}
            setDescriptionContent={setCommentContent}
          />
        ) : (
          <RichTextFieldWithContent
            descriptionContent={commentState?.initialCommentContent}
            setDescriptionContent={setCommentContent}
          />
        )}
        {errorMessage?.body && <ErrorMessage message={errorMessage.body} />}
        <button
          className="btn btn-default link-button"
          style={{
            marginTop: "0",
            padding: "10px 30px",
            fontSize: "1.4rem",
          }}
          type="submit"
          id="answer-to-question"
        >
          Comment
        </button>
        {/* <button
          className="btn btn-default link-button"
          style={{
            marginTop: "0",
            marginLeft: "10px",
            padding: "10px 30px",
            fontSize: "1.4rem",
            display: "none",
          }}
          type="button"
          id="cancel-editing"
          onClick={cancelEditing}
        >
          Cancel
        </button> */}
        {isSuccess && (
          <p
            className="message-success mt-3"
            style={{ textAlign: "center", color: "#964202" }}
          >
            Your comment has been saved successfully. To see it, reload the
            page.
          </p>
        )}
      </form>
    </>
  );
};
