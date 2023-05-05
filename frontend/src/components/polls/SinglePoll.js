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
                      commentState={commentState}
                      setCommentState={setCommentState}
                    />
                    {index !== comments?.length - 1 && (
                      <>
                        <br></br>
                        <hr></hr>
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

export const Comment = ({ user, comment, commentState, setCommentState }) => {
  const { id, created_at, updated_at, likes, author, body } = comment;

  const deleteComment = (id) => {
    apiCall
      .delete(`/api/v1/poll_comments/${id}/`)
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
