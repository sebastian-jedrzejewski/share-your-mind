import "./questions.css";
import { useState } from "react";
import answer2 from "../../assets/answer2.png";
import like from "../../assets/like.png";
import { getCategoryString, getDateString } from "./utils";
import FilterBar from "../FilterBar/FilterBar";
import {
  NEWEST,
  QUESTION_CONTENT_TYPE,
} from "../../constants/search_constants";
import useSearchContent from "../../hooks/useSearchContent";

export const Questions = () => {
  const defaultSearchData = {
    object_content_type: QUESTION_CONTENT_TYPE,
    order_by: [NEWEST],
  };

  const [searchData, setSearchData] = useState(defaultSearchData);

  const [searchFormState, setSearchFormState] = useState({
    checkBoxChecked: false,
    query: "",
    selectedCategories: [],
  });

  const { data, isLoading } = useSearchContent(searchData);

  if (isLoading) {
    return null;
  }

  return (
    <div className="container main-content">
      <FilterBar
        searchData={searchData}
        setSearchData={setSearchData}
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
      />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {data.map((question) => {
            return <Question key={question.id} question={question} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const Question = ({ question }) => {
  const {
    id,
    created_at,
    author,
    heading,
    short_description,
    likes,
    number_of_answers,
    categories,
  } = question;

  return (
    <div className="welcome-container question-box">
      <div className="row">
        <div className="col-md-6 author">
          {/* <img
            src={answer}
            width="30px"
            height="30px"
            style={{ marginRight: "5px" }}
          /> */}
          {author?.username}{" "}
          <span className="date">asked {getDateString(created_at)}</span>
        </div>
        <div className="col-md-6 categories">
          {getCategoryString(categories)}
        </div>
      </div>
      <p className="question-heading">
        <a href={`/questions/${id}`}>{heading}</a>
      </p>
      {short_description && (
        <p
          className="question-description"
          dangerouslySetInnerHTML={{ __html: short_description }}
        />
      )}
      <div className="question-footer">
        <div className="question-wrapper">
          <div className="question-info">
            <div>
              <img src={like} alt="likes" width="25px" height="21px" />
              <span>
                <span>{likes}</span> likes
              </span>
            </div>
          </div>
          <div className="question-info">
            <div>
              <img src={answer2} alt="answers" width="25px" height="23px" />
              <span>
                <span>{number_of_answers}</span> answers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
