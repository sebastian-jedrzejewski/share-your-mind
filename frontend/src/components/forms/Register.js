import { ErrorMessage, SubmitButton } from "./FormControls";
import { useStyles } from "./useStyles";
import { useState } from "react";
import apiCall from "../../api/axios";

const Register = () => {
  const classes = useStyles();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  });
  const [errorField, setErrorField] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    tmpSuccessMessage: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall
      .post("/auth/users/", { ...user })
      .then(() =>
        setErrorField({ tmpSuccessMessage: "You created the account!" })
      )
      .catch((error) => setErrorField({ ...error.response.data }));
  };

  return (
    <div className="container" style={{ paddingBottom: "150px" }}>
      <div className="row mt-5">
        <div className="col-9 col-lg-4 bg-white m-auto px-5 py-3">
          <h2 className="text-center mt-3">Sign up now</h2>
          <p className="text-center text-muted mb-4">
            Join our community and share knowledge with others!
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Username*"
            />
            {errorField.username && (
              <ErrorMessage message={errorField.username} />
            )}
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Email*"
            />
            {errorField.email && <ErrorMessage message={errorField.email} />}
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="First Name"
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Last Name"
            />
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Password*"
            />
            {errorField.password && (
              <ErrorMessage message={errorField.password} />
            )}
            <input
              type="password"
              id="password2"
              name="password2"
              value={user.password2}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Confirm Password*"
            />
            {errorField.password2 && (
              <ErrorMessage message={errorField.password2} />
            )}
            <SubmitButton text="Register" />
            <p className="text-center">
              By clicking Register button you accept our{" "}
              <a className={classes.link} href="/register">
                terms and conditions
              </a>
            </p>
            <p className="text-center">
              Already have an account?{" "}
              <a className={classes.link} href="/login">
                Login
              </a>
            </p>
            {errorField.tmpSuccessMessage && (
              <ErrorMessage message={errorField.tmpSuccessMessage} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
