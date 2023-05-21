import "./polls.css";
import { useParams } from "react-router-dom";
import { getDateString } from "../questions/utils";
import useFetchData from "../../hooks/useFetchData";
import { useEffect, useState } from "react";
import RichTextField, {
  RichTextFieldWithContent,
} from "../forms/RichTextField";
import { isAuthenticated } from "../../auth/auth";
import apiCall from "../../api/axios";
import { ErrorMessage } from "../forms/FormControls";
import LoginModal, { showLoginModal } from "../modals/LoginModal";
import useFetchUser from "../../hooks/useFetchUser";
import DeleteModal, { showDeleteModal } from "../modals/DeleteModal";
import { ContentLikes } from "../questions/SingleQuestion";
import { Poll } from "./Polls";
import { Tooltip } from "react-tooltip";
import { useCollapse } from "react-collapsed";
import up from "../../assets/up.png";
import down from "../../assets/down.png";

export const SinglePoll = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchData(`/api/v1/polls/${id}/`);
  const { data: votedAnswers } = useFetchData("/api/v1/voted_poll_answers/");
  const { user } = useFetchUser();

  const [showEdit, setShowEdit] = useState(false);

  const [commentState, setCommentState] = useState({
    initialCommentContent: "",
    commentContent: "",
    isCommentModified: false,
    commentId: "",
  });

  useEffect(() => {
    if (!isLoading) {
      const { author } = data;
      if (user?.username === author?.username) {
        setShowEdit(true);
      } else {
        setShowEdit(false);
      }
    }
  }, [isLoading, data, user?.username]);

  if (isLoading) {
    return null;
  }

  const poll = data;
  const { comments } = poll;

  const deletePoll = (id) => {
    apiCall.delete(`/api/v1/polls/${id}/`);
    window.location.href = "/polls";
  };

  return (
    <div className="container main-content">
      <LoginModal />
      <DeleteModal contentType={"poll"} modalId={"poll-delete-modal"} />
      <DeleteModal contentType={"comment"} modalId={"comment-delete-modal"} />
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <Poll
            poll={poll}
            votedAnswers={votedAnswers}
            commentsBarNeeded={false}
            showEdit={showEdit}
            editContent={{
              deleteModalId: "poll-delete-modal",
              deleteAction: deletePoll,
              contentId: id,
            }}
          />
          <p className="answer-note">
            {comments?.length} {comments?.length === 1 ? "Comment" : "Comments"}
          </p>

          {comments?.length > 0 && (
            <div className="welcome-container question-box">
              {comments.map((comment, index) => {
                return (
                  <span key={comment.id}>
                    <Comment
                      key={comment.id}
                      user={user}
                      comment={comment}
                      pollId={id}
                      commentState={commentState}
                      setCommentState={setCommentState}
                    />
                    {index !== comments?.length - 1 &&
                      comment?.parent_comment_id === null && (
                        <>
                          <br></br>
                          <hr style={{ borderTop: "2px dashed #a7727d" }}></hr>
                        </>
                      )}
                  </span>
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

export const EditDelete = ({
  deleteModalId,
  deleteAction,
  contentId,
  commentState,
  setCommentState,
}) => {
  const { data } = useFetchData(
    deleteModalId.startsWith("poll")
      ? `/api/v1/polls/${contentId}`
      : `/api/v1/poll_comments/${contentId}`
  );

  const goToEditPage = () => {
    window.location.href = `/edit-poll/${contentId}`;
  };

  const scrollToEditComment = () => {
    const yourPollComment = document.getElementById("your-poll-comment");
    if (yourPollComment) {
      yourPollComment.scrollIntoView({ behavior: "smooth" });
    }
    const commentToPoll = document.getElementById("comment-to-poll");
    if (commentToPoll) {
      commentToPoll.innerHTML = "Save changes";
    }
    const cancelEditing = document.getElementById("cancel-editing");
    if (cancelEditing) {
      cancelEditing.style.display = "inline-block";
    }
    setCommentState({
      isCommentModified: true,
      commentId: contentId,
      commentContent: data?.body,
      initialCommentContent: data?.body,
    });
  };

  return (
    <div className="poll-edit-delete">
      <button
        onClick={
          deleteModalId.startsWith("poll") ? goToEditPage : scrollToEditComment
        }
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

export const Comment = ({
  user,
  comment,
  pollId,
  commentState,
  setCommentState,
}) => {
  const {
    id,
    created_at,
    updated_at,
    likes,
    author,
    body,
    parent_comment_id,
    nested_comments,
  } = comment;
  const [showCommentField, setShowCommentField] = useState(false);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const deleteComment = (id) => {
    apiCall
      .delete(`/api/v1/poll_comments/${id}/`)
      .then(() => document.location.reload());
  };

  if (parent_comment_id) {
    return null;
  }

  return (
    <>
      <div className="row">
        <div className="col-md-9 author">
          {author?.username}{" "}
          <span className="date">commented {getDateString(created_at)}</span>
          {getDateString(created_at) !== getDateString(updated_at) && (
            <span className="date">, modified {getDateString(updated_at)}</span>
          )}
        </div>
        <div className="col-md-3 ref-answer">
          <span
            id={`answer-to-poll-comment${id}`}
            style={{ cursor: "pointer" }}
            data-tooltip-id="answer-tooltip"
            data-tooltip-content="Answer to this comment"
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => {
                setShowCommentField(!showCommentField);
                if (showCommentField) {
                  e.target.innerHTML = "Answer";
                  document
                    .getElementById(`answer-to-poll-comment${id}`)
                    .setAttribute(
                      "data-tooltip-content",
                      "Answer to this comment"
                    );
                } else {
                  e.target.innerHTML = "Cancel";
                  document
                    .getElementById(`answer-to-poll-comment${id}`)
                    .setAttribute("data-tooltip-content", "Cancel answering");
                }
              }}
            >
              Answer
            </button>
          </span>
          <Tooltip id="answer-tooltip" place="bottom" />
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

      {user?.username === author?.username && (
        <EditDelete
          deleteModalId={"comment-delete-modal"}
          deleteAction={deleteComment}
          contentId={id}
          commentState={commentState}
          setCommentState={setCommentState}
        />
      )}

      {showCommentField && (
        <NestedCommentField pollId={pollId} commentId={id} />
      )}

      {nested_comments?.length > 0 && (
        <div className="drop-answers" {...getToggleProps()}>
          <span style={{ marginRight: "5px" }}>
            <img width="30" src={isExpanded ? up : down} alt="up/down" />
          </span>
          {`${nested_comments?.length} answer` +
            (nested_comments?.length > 1 ? "s" : "")}
        </div>
      )}

      {nested_comments?.length > 0 && (
        <div className="welcome-container question-box" {...getCollapseProps()}>
          {nested_comments.map((comment, index) => {
            return (
              <>
                <NestedComment
                  key={comment.id}
                  user={user}
                  comment={comment}
                  commentState={setCommentState}
                  setCommentState={setCommentState}
                />
                {index !== nested_comments?.length - 1 && (
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
    </>
  );
};

export const NestedComment = ({
  user,
  comment,
  commentState,
  setCommentState,
}) => {
  const { id, created_at, updated_at, likes, author, body } = comment;

  const deleteComment = (id) => {
    apiCall
      .delete(`/api/v1/poll_comments/${id}`)
      .then(() => document.location.reload());
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
        contentType={"poll_comment"}
        contentText={"comment"}
        initialState={likes}
        contentId={id}
      />

      {user?.username === author?.username && (
        <EditDelete
          deleteModalId={"comment-delete-modal"}
          deleteAction={deleteComment}
          contentId={id}
          commentState={commentState}
          setCommentState={setCommentState}
        />
      )}
    </>
  );
};

export const CommentField = ({ pollId, commentState, setCommentState }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ body: "" });

  useEffect(() => {
    if (commentState?.isCommentModified === false) {
      document.getElementById("comment-to-poll").innerHTML = "Comment";
    }
  }, [commentState?.isCommentModified]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      if (!commentState?.isCommentModified) {
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
      } else {
        apiCall
          .patch(`/api/v1/poll_comments/${commentState?.commentId}/`, {
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
              initialCommentContent: "",
            });
          })
          .catch((error) => {
            setErrorMessage({ ...error.response.data });
            console.log(error.response.data);
          });
      }
      document.getElementById("cancel-editing").style.display = "none";
    } else {
      showLoginModal();
    }
  };

  const setCommentContent = (commentContent) => {
    setCommentState({ ...commentState, commentContent: commentContent });
  };

  const cancelEditing = (e) => {
    setCommentState({
      ...commentState,
      isCommentModified: false,
      initialCommentContent: "",
    });
    e.target.style.display = "none";
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="answer-note" id="your-poll-comment">
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
          id="comment-to-poll"
        >
          Comment
        </button>
        <button
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
        </button>
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

export const NestedCommentField = ({ pollId, commentId }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ body: "" });
  const [commentContent, setCommentContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall
      .post("/api/v1/poll_comments/", {
        poll_id: pollId,
        poll_comment_id: commentId,
        body: commentContent,
      })
      .then(() => {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        setCommentContent("");
        setErrorMessage({ body: "" });
      })
      .catch((error) => {
        setErrorMessage({ ...error.response.data });
        console.log(error.response.data);
      });
  };

  const cancelEditing = (e) => {
    setCommentContent("");
    e.target.style.display = "none";
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p
          className="answer-note nested-comment"
          id={`your-poll-comment-to${commentId}`}
          style={{ marginTop: "1rem" }}
        >
          Your Comment
        </p>
        <RichTextField
          descriptionContent={""}
          setDescriptionContent={setCommentContent}
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
          id={`blog-poll-to-comment${commentId}`}
        >
          Comment
        </button>
        <button
          className="btn btn-default link-button"
          style={{
            marginTop: "0",
            marginLeft: "10px",
            padding: "10px 30px",
            fontSize: "1.4rem",
            display: "none",
          }}
          type="button"
          id={`cancel-editing-to-poll-comment${commentId}`}
          onClick={cancelEditing}
        >
          Cancel
        </button>
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
