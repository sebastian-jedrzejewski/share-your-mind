import { useParams } from "react-router-dom";
import { getCategoryString, getDateString } from "./utils";
import useFetchData from "../../hooks/useFetchData";
import "./questions.css";
import like from "../../assets/like.png";

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
    <div className="container">
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
            <div className="question-footer">
              <div
                className="question-info like-question"
                title="Like the question to make it more popular"
              >
                <img src={like} alt="likes" width="25px" height="21px" />
                <span>Like this question ({likes})</span>
              </div>
            </div>
          </div>

          <p className="answer-note">
            {answers?.length} {answers?.length === 1 ? "Answer" : "Answers"}
          </p>

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
        </div>
      </div>
    </div>
  );
};

export const Answer = ({ answer }) => {
  const { created_at, updated_at, likes, author, body } = answer;

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
      <div className="question-footer">
        <div
          className="question-info like-question"
          title="Like the answer to make it more popular"
        >
          <img src={like} alt="likes" width="25px" height="21px" />
          <span>Like this answer ({likes})</span>
        </div>
      </div>
    </>
  );
};
