import { isAuthenticated } from "../../auth/auth";
import "./filterbar.css";

const FilterBar = () => {
  const toggleCheck = () => {
    document.getElementById("recommended-only").checked =
      !document.getElementById("recommended-only").checked;
  };

  const checkAuthenticity = () => {
    if (isAuthenticated()) {
      window.location.href = "/ask-question";
    }
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
