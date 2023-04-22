import { useEffect, useState } from "react";
import MultiSelect from "../forms/MulitSelect";
import useFetchUser from "../../hooks/useFetchUser";
import apiCall from "../../api/axios";

const Profile = () => {
  const { user, isLoading } = useFetchUser();
  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    favouriteCategories: "",
  });

  useEffect(() => {
    let categories = [];
    let name;
    user?.favourite_categories.map((category) => {
      name = category?.name.charAt(0).toUpperCase() + category?.name.slice(1);
      return categories.push({
        value: category?.name,
        label: name,
        id: category?.id,
      });
    });

    setProfileData({
      username: user?.username,
      firstName: user?.first_name,
      lastName: user?.last_name,
      favouriteCategories: categories,
    });
  }, [user]);

  if (isLoading) {
    return null;
  }

  const setSelectedCategories = (selectedCategories) => {
    setProfileData({ ...profileData, favouriteCategories: selectedCategories });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let categoriesIds = [];
    for (let i = 0; i < profileData?.favouriteCategories.length; i++) {
      categoriesIds.push({
        id: parseInt(profileData?.favouriteCategories[i].id),
      });
    }

    const editData = {
      username: profileData?.username,
      first_name: profileData?.firstName,
      last_name: profileData?.lastName,
      favourite_categories: categoriesIds,
    };

    apiCall
      .patch("/auth/users/me/", editData)
      .catch((error) => console.log(error.response.data));
  };

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
          <form className="default-form" onSubmit={handleSubmit}>
            <label htmlFor="username" className="form-title">
              <strong>Username:</strong>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData?.username}
              onChange={handleChange}
              className="form-control default-input mb-3"
              style={{ color: "#964202", fontSize: "1.3rem" }}
            />

            <label htmlFor="first-name" className="form-title">
              <p>First name:</p>
            </label>
            <input
              type="text"
              id="first-name"
              name="firstName"
              value={profileData?.firstName}
              onChange={handleChange}
              className="form-control mb-3"
              style={{ color: "#964202", fontSize: "1.3rem" }}
            />

            <label htmlFor="last-name" className="form-title">
              <p>Last name:</p>
            </label>
            <input
              type="text"
              id="last-name"
              name="lastName"
              value={profileData?.lastName}
              onChange={handleChange}
              className="form-control mb-3"
              style={{ color: "#964202", fontSize: "1.3rem" }}
            />

            <label className="form-title">
              <p>Favourite categories:</p>
            </label>
            <MultiSelect
              selectedCategories={profileData?.favouriteCategories}
              setSelectedCategories={setSelectedCategories}
            />

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
