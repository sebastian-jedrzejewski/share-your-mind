import { Modal } from "bootstrap";

export const showRecommendedModal = () => {
  const myModal = new Modal(document.getElementById("recommendedModal"));
  myModal.show();
};

const RecommendedModal = () => {
  return (
    <div
      className="modal fade"
      id="recommendedModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" style={{ color: "#964202" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Add favourite categories
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            To see the effect of this action, go to{" "}
            <a href="/edit-profile">edit profile</a> page and add you favourite
            categories so that we know which content might appeal to you.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default link-button"
              data-bs-dismiss="modal"
              style={{ padding: "10px 30px", marginTop: "0" }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedModal;
