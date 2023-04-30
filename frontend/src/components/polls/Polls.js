import { useState } from "react";
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
            return <Poll key={poll.id} poll={poll} />;
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

export const Poll = ({ poll }) => {
  const {
    id,
    created_at,
    author,
    heading,
    votes,
    number_of_comments,
    categories,
  } = poll;

  const { data, isLoading } = useFetchData(`/api/v1/polls/${id}/`);

  if (isLoading) {
    return null;
  }

  const answers = data?.answers;

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
      <div className="question-description">
        {answers?.map((answer, index) => {
          return (
            <>
              <div className="form-check vote-form-check">
                <input
                  className="form-check-input vote-check-input"
                  type="radio"
                  name={`radio${id}`}
                  id={`flexRadio${id + index}`}
                />
                <label
                  className="form-check-label vote-label"
                  htmlFor={`flexRadio${id + index}`}
                >
                  {answer?.heading}
                </label>
              </div>
            </>
          );
        })}
      </div>
      <button
        className="btn btn-default link-button"
        style={{ marginTop: "5px", marginBottom: "5px", fontSize: "1.2rem" }}
      >
        Vote
      </button>
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
