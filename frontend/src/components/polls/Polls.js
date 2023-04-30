import { useEffect, useState } from "react";
import comment from "../../assets/comment.png";
import {
  getCategoryString,
  getCategoryListString,
  getDateString,
} from "../questions/utils";
import FilterBar from "../FilterBar/FilterBar";
import { NEWEST, POLL_CONTENT_TYPE } from "../../constants/search_constants";
import useSearchContent from "../../hooks/useSearchContent";

import { Tooltip } from "react-tooltip";
import CustomPagination from "../Pagination/CustomPagination";
import { PAGE_SIZE } from "../../constants/common_constants";
import useFetchData from "../../hooks/useFetchData";
import apiCall from "../../api/axios";

export const Polls = () => {
  const defaultSearchData = {
    object_content_type: POLL_CONTENT_TYPE,
    order_by: [NEWEST],
    page: 1,
  };

  const [searchData, setSearchData] = useState(defaultSearchData);

  const [searchFormState, setSearchFormState] = useState({
    checkBoxChecked: false,
    query: "",
    selectedCategories: [],
  });

  const { data, isLoading } = useSearchContent(searchData);

  const [currentPage, setCurrentPage] = useState(1);
  const { data: votedAnswers } = useFetchData("/api/v1/voted_poll_answers/");

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
        contentType={"poll"}
        mostFilters={[
          { id: "most-comments", name: "Most Comments" },
          { id: "most-votes", name: "Most Votes" },
        ]}
      />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p className="results-count">{data?.count} results</p>
          {data?.results?.map((poll) => {
            return (
              <Poll key={poll.id} poll={poll} votedAnswers={votedAnswers} />
            );
          })}
        </div>
      </div>
      {Math.ceil(data?.count / PAGE_SIZE) > 1 && (
        <CustomPagination
          totalCount={data?.count}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      )}
    </div>
  );
};

export const Poll = ({ poll, votedAnswers }) => {
  const {
    id,
    created_at,
    author,
    heading,
    votes,
    number_of_comments,
    categories,
  } = poll;

  const { data } = useFetchData(`/api/v1/polls/${id}/`);

  const [selectedOption, setSelectedOption] = useState("");

  const markPollAsVoted = (selectedAnswer) => {
    let radioButton, answer, answerFill, percentage;
    for (let i = 0; i < answers?.length; i++) {
      radioButton = document.querySelector(`#flexRadio${answers[i]?.id}`);
      answer = document.querySelector(
        `#flexRadio${answers[i]?.id} + .vote-label .vote-label-text`
      );
      answerFill = document.querySelector(
        `#flexRadio${answers[i]?.id} + .vote-label .vote-label-fill`
      );

      if (answer && answerFill) {
        percentage = (100 * answers[i]?.votes) / votes;
        answer.innerHTML += ` (${percentage}%)`;
        answerFill.style.width = `${percentage}%`;
      }

      console.log(answers[i]?.id, selectedAnswer);
      if (answers[i]?.id + "" === selectedAnswer + "") {
        setSelectedOption(answers[i]?.id + "");
        radioButton.checked = true;
      }
      radioButton.disabled = true;
      document.getElementById(`vote${id}`).disabled = true;
    }
  };

  const answers = data?.answers;
  useEffect(() => {
    for (let i = 0; i < answers?.length; i++) {
      if (votedAnswers?.voted_poll_answers_ids?.includes(answers[i]?.id)) {
        markPollAsVoted(answers[i]?.id);
        break;
      }
    }
  }, [answers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall.post(`/api/v1/poll_answers/${selectedOption}/vote/`);

    markPollAsVoted(selectedOption);
  };

  const onValueChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="welcome-container question-box">
      <div className="row">
        <div className="col-md-6 author">
          {author?.username}{" "}
          <span className="date">asked {getDateString(created_at)}</span>
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
      <p style={{ marginTop: "0" }}>{votes} votes</p>
      <form onSubmit={handleSubmit}>
        <div className="question-description">
          {answers?.map((answer) => {
            return (
              <>
                <div className="form-check vote-form-check">
                  <input
                    className="form-check-input vote-check-input"
                    type="radio"
                    name={`radio${id}`}
                    value={answer?.id}
                    id={`flexRadio${answer?.id}`}
                    checked={selectedOption === answer?.id + ""}
                    onChange={onValueChange}
                  />
                  <label
                    className="form-check-label vote-label"
                    htmlFor={`flexRadio${answer?.id}`}
                  >
                    <span className="vote-label-text">{answer?.heading}</span>
                    <span className="vote-label-fill"></span>
                  </label>
                </div>
              </>
            );
          })}
        </div>
        <button
          className="btn btn-default link-button"
          style={{ marginTop: "5px", marginBottom: "5px", fontSize: "1.2rem" }}
          type="submit"
          id={`vote${id}`}
        >
          Vote
        </button>
      </form>
      <div className="question-footer">
        <div className="question-wrapper">
          <div className="question-info" style={{ width: "60%" }}>
            <div>
              <img src={comment} alt="likes" width="25px" height="21px" />
              <span>{number_of_comments} comments</span>
              <Tooltip id="like-tooltip" place="bottom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
