import { Modal } from "bootstrap";

export const showErrorModal = () => {
  const myModal = new Modal(document.getElementById("errorModal"));
  myModal.show();
};

const ErrorModal = () => {
  return (
    <div
      className="modal fade"
      id="errorModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title"
              id="exampleModalLabel"
              style={{ color: "red" }}
            >
              Something went wrong
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ color: "red", textAlign: "justify" }}
          >
            There's a problem on our site and not all functionalities might be
            available. Please be patient and try again later. Sorry for
            inconvienience.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default btn-danger"
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

export default ErrorModal;
