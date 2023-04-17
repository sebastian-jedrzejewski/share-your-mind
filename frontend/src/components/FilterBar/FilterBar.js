import { useEffect } from "react";
import { isAuthenticated } from "../../auth/auth";
import "./filterbar.css";
import LoginModal, { showLoginModal } from "../Modals/LoginModal";
import {
  MOST_ANSWERS,
  MOST_LIKES,
  NEWEST,
} from "../../constants/search_constants";
import MultiSelect from "../forms/MulitSelect";

const FilterBar = ({
  searchData,
  setSearchData,
  checkBoxChecked,
  setCheckBoxChecked,
}) => {
  const toggleCheck = () => {
    const recommendedCheckBox = document.getElementById("recommended-only");
    recommendedCheckBox.checked = !recommendedCheckBox.checked;

    if (recommendedCheckBox.checked) {
      setCheckBoxChecked(true);
      setSearchData({ ...searchData, is_recommended: true });
    } else {
      setCheckBoxChecked(false);
      setSearchData({ ...searchData, is_recommended: false });
    }
  };

  const checkAuthenticity = () => {
    if (isAuthenticated()) {
      window.location.href = "/ask-question";
    } else {
      showLoginModal();
    }
  };

  useEffect(() => {
    const orderBy = searchData?.order_by;
    document
      .getElementsByClassName("filter-block")
      ?.classList?.remove("underlined");
    if (orderBy[0] === NEWEST) {
      document.getElementById("newest")?.classList.add("underlined");
    } else if (orderBy[0] === MOST_LIKES) {
      document.getElementById("most-likes")?.classList.add("underlined");
    } else if (orderBy[0] === MOST_ANSWERS) {
      document.getElementById("most-answers")?.classList.add("underlined");
    }

    if (checkBoxChecked === true) {
      document.getElementById("recommended-only").checked = true;
      document
        .getElementById("recommended-only")
        .classList.add("recommendedChecked");
    } else {
      document.getElementById("recommended-only").checked = false;
      document
        .getElementById("recommended-only")
        .classList.remove("recommendedChecked");
    }
  }, [searchData, checkBoxChecked]);

  const changeOrder = (e) => {
    if (e?.target?.id === "newest" && searchData?.order_by[0] !== NEWEST) {
      setSearchData({ ...searchData, order_by: [NEWEST] });
    } else if (
      e?.target?.id === "most-likes" &&
      searchData?.order_by[0] !== MOST_LIKES
    ) {
      setSearchData({ ...searchData, order_by: [MOST_LIKES] });
    } else if (
      e?.target?.id === "most-answers" &&
      searchData?.order_by[0] !== MOST_ANSWERS
    ) {
      setSearchData({ ...searchData, order_by: [MOST_ANSWERS] });
    }
  };

  return (
    <>
      <div className="filterbar">
        <LoginModal />
        <div className="row gx-0">
          <div
            id="newest"
            className="col-md-2 filter-block"
            onClick={changeOrder}
          >
            Newest Questions
          </div>
          <div
            id="most-answers"
            className="col-md-2 filter-block"
            onClick={changeOrder}
          >
            Most Answers
          </div>
          <div
            id="most-likes"
            className="col-md-2 filter-block"
            onClick={changeOrder}
          >
            Most Likes
          </div>
          <div
            className="col-md-3 filter-block"
            id="recommended"
            onClick={() => toggleCheck()}
          >
            <label className="toggler-wrapper style-1">
              <input type="checkbox" id="recommended-only" />
              <div className="toggler-slider">
                <div className="toggler-knob"></div>
              </div>
            </label>
            <div className="badge">Only Recommended</div>
          </div>

          <div className="col-md-3 question-btn filter-block">
            <div
              className="btn btn-default link-button"
              style={{ marginTop: "0", padding: "10px 30px" }}
              onClick={() => checkAuthenticity()}
            >
              Ask Question
            </div>
          </div>
        </div>
      </div>
      <div
        className="search-form col-md-10 offset-md-1 mt-4"
        // style={{ backgroundColor: "red" }}
      >
        <div className="row gx-0">
          <div className="col-md-5">
            <input
              type="text"
              id="search"
              name="search"
              className="form-control mb-3 search-control"
              placeholder="Search"
            />
          </div>
          <div className="col-md-5">
            <MultiSelect />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary search-button"
              style={{
                width: "100%",
                height: "45px",
                color: "#fff",
                marginLeft: "5px",
              }}
              type="submit"
              id="ask-question-submit"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
