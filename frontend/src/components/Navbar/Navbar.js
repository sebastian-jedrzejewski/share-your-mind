import { makeStyles } from "@material-ui/core";
import { performLogout } from "../../auth/auth";
import logo from "../../assets/logo.png";
import "./navbar.css";

import NavDropdown from "react-bootstrap/NavDropdown";

const useStyles = makeStyles({
  navbarCustom: {
    backgroundColor: "#A7727D",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem",
  },
});

const Navbar = ({ user, isLoading, activeLink }) => {
  const classes = useStyles();

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark ${classes.navbarCustom}`}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <div className={classes.logoBox}>
            <img
              src={logo}
              alt=""
              width="45"
              height="45"
              className="d-inline-block mx-2"
            />
            ShareYourMind
          </div>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                id="home-link"
                className={`nav-link home ${
                  activeLink === "home-link" ? "active" : ""
                }`}
                style={{ fontSize: "1.1rem" }}
                aria-current="page"
                href="/"
              >
                Home
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a
                id="questions-link"
                className={`nav-link ${
                  activeLink === "questions-link" ? "active" : ""
                }`}
                href="/questions"
              >
                Questions
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a
                id="blogs-link"
                className={`nav-link ${
                  activeLink === "blogs-link" ? "active" : ""
                }`}
                href="/"
              >
                Blog posts
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a
                id="polls-link"
                className={`nav-link ${
                  activeLink === "polls-link" ? "active" : ""
                }`}
                href="/polls"
              >
                Polls
              </a>
            </li>
          </ul>
          <div className="d-flex justify-content-center navbar-right">
            <NavbarRightSide user={user} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavbarRightSide = ({ user, isLoading }) => {
  if (isLoading) {
    return null;
  } else if (user?.username) {
    return (
      <>
        <NavDropdown
          style={{ color: "#DCCAB6", fontSize: "1.5rem" }}
          title={`Hi, ${user.username}!`}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item href="/edit-profile">Edit profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            onClick={() => {
              performLogout();
            }}
          >
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  } else {
    return (
      <>
        <a href="/login">
          <button type="button" className="btn button-custom login-button">
            Login
          </button>
        </a>
        <a href="/register">
          <button type="button" className="btn button-custom">
            Register
          </button>
        </a>
      </>
    );
  }
};

export default Navbar;
