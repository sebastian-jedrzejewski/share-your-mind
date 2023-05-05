import { Modal } from "bootstrap";

export const showDeleteModal = (modalId, deleteAction, contentId) => {
  const myModal = new Modal(document.getElementById(modalId));
  const deleteButton = document.querySelector(
    `#${modalId} .modal-dialog .modal-content .modal-footer #delete-btn-${modalId}`
  );

  deleteButton.addEventListener("click", () => {
    deleteAction(contentId);
  });
  myModal.show();
};

const DeleteModal = ({ contentType, modalId }) => {
  return (
    <div
      className="modal fade"
      id={modalId}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" style={{ color: "#964202" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Delete {contentType}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this {contentType}?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              No
            </button>
            <button
              id={`delete-btn-${modalId}`}
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
