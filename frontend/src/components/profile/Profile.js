import { useState } from "react";
import MultiSelect from "../forms/MulitSelect";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    favouriteCategories: "",
  });

  return (
    <div className="container main-content">
      <div className="row">
        <div
          className="col-md-6 offset-md-3 welcome-container"
          style={{ color: "#964202" }}
        >
          <div className="ask-header">
            <p>Edit Your Profile</p>
          </div>
          <form className="default-form">
            <label htmlFor="username" className="form-title">
              <strong>Username:</strong>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              //   value={user.email}
              //   onChange={handleChange}
              className="form-control mb-3"
            />

            <label htmlFor="first-name" className="form-title">
              <p>First name:</p>
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              //   value={user.email}
              //   onChange={handleChange}
              className="form-control mb-3"
            />

            <label htmlFor="last-name" className="form-title">
              <p>Last name:</p>
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              //   value={user.email}
              //   onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-title">
              <p>Favourite categories:</p>
            </label>
            <MultiSelect />

            <div className="submit-wrapper">
              <button
                className="btn btn-default link-button"
                style={{
                  marginTop: "2rem",
                  padding: "10px 30px",
                  fontSize: "1.4rem",
                }}
                type="submit"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
