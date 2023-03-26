import { useEffect } from "react";
import "./filterbar.css";

const FilterBar = () => {
  const toggleCheck = () => {
    document.getElementById("recommended-only").checked =
      !document.getElementById("recommended-only").checked;
  };

  return (
    <div className="filterbar">
      <div className="row gx-0">
        <div className="col-md-2 filter-block">Newest Questions</div>
        <div className="col-md-2 filter-block">Most Answers</div>
        <div className="col-md-2 filter-block">Most Likes</div>
        <div
          className="col-md-3 filter-block"
          id="recommended"
          onClick={() => toggleCheck()}
        >
          <label class="toggler-wrapper style-1">
            <input type="checkbox" id="recommended-only" />
            <div class="toggler-slider">
              <div class="toggler-knob"></div>
            </div>
          </label>
          <div class="badge">Only Recommended</div>
        </div>

        <div className="col-md-3 question-btn filter-block">
          <a href="/ask-question">
            <div
              className="btn btn-default link-button"
              style={{ marginTop: "0", padding: "10px 30px" }}
            >
              Ask Question
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
