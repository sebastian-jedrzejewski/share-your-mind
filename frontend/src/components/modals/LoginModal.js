import { Modal } from "bootstrap";

export const showLoginModal = () => {
  const myModal = new Modal(document.getElementById("loginModal"));
  myModal._element.addEventListener("hidden.bs.modal", () => {
    myModal.hide();
  });
  myModal.show();
};

const LoginModal = () => {
  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" style={{ color: "#964202" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Login required
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            To get into here you have to <a href="/login">login</a>.
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

export default LoginModal;
