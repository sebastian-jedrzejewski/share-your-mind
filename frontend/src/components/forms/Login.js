import { SubmitButton } from "./FormControls";
import { ErrorMessage } from "./FormControls";
import { useState } from "react";
import axios from "axios";
import { performAuthentication } from "../../auth/auth";
import { useStyles } from "./useStyles";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errorField, setErrorField] = useState({
    email: "",
    password: "",
    detail: "",
  });
  const classes = useStyles();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/jwt/create/", { ...user })
      .then((response) => {
        performAuthentication(response);
        navigate("/");
      })
      .catch((error) => {
        setErrorField({ ...error.response.data });
      });
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-9 col-lg-4 bg-white m-auto px-5 py-3">
          <h2 className="text-center mt-3">Sign in now</h2>
          <p className="text-center text-muted mb-4">
            It's a good time to learn something new!
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Email"
            />
            {errorField.email && <ErrorMessage message={errorField.email} />}
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Password"
            />
            {errorField.password && (
              <ErrorMessage message={errorField.password} />
            )}
            <SubmitButton text="Login" />
            {errorField.detail && <ErrorMessage message={errorField.detail} />}
            <p className="text-center">
              Don't have an account?{" "}
              <a className={classes.link} href="/register">
                Signup
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
