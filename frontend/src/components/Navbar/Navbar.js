import { makeStyles } from "@material-ui/core";
import logo from "../../assets/logo.png";
import "./navbar.css";

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

const Navbar = ({ user, isLoading }) => {
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
                className="nav-link active home"
                style={{ fontSize: "1.1rem" }}
                aria-current="page"
                href="/"
              >
                Home
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a className="nav-link" href="/">
                Questions
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a className="nav-link" href="/">
                Blog posts
              </a>
            </li>
            <li className="nav-item" style={{ fontSize: "1.1rem" }}>
              <a className="nav-link" href="/">
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
    return <h1 style={{ color: "#DCCAB6" }}>{`Hi, ${user.username}!`}</h1>;
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
