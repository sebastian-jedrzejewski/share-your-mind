import { useEffect } from "react";
import { isAuthenticated } from "../../auth/auth";
import "./filterbar.css";
import LoginModal, { showLoginModal } from "../Modals/LoginModal";

const FilterBar = ({ searchData, setSearchData }) => {
  const toggleCheck = () => {
    document.getElementById("recommended-only").checked =
      !document.getElementById("recommended-only").checked;
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
    if (orderBy[0] === "-created_at") {
      document.getElementById("newest")?.classList.add("underlined");
    } else if (orderBy[0] === "-likes") {
      document.getElementById("most-likes")?.classList.add("underlined");
    } else if (orderBy[0] === "-answers") {
      document.getElementById("most-answers")?.classList.add("underlined");
    }
  }, [searchData]);

  const changeOrder = (e) => {
    if (
      e?.target?.id === "newest" &&
      searchData?.order_by[0] !== "-created_at"
    ) {
      setSearchData({ ...searchData, order_by: ["-created_at"] });
    } else if (
      e?.target?.id === "most-likes" &&
      searchData?.order_by[0] !== "-likes"
    ) {
      setSearchData({ ...searchData, order_by: ["-likes"] });
    } else if (
      e?.target?.id === "most-answers" &&
      searchData?.order_by[0] !== "-answers"
    ) {
      setSearchData({ ...searchData, order_by: ["-answers"] });
    }
  };

  return (
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
  );
};

export default FilterBar;
