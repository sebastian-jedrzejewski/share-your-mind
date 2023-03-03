import { Input, SubmitButton } from "./FormControls";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "#02469e",
    "&:hover": {
      color: "#00247c",
    },
  },
});

const Register = () => {
  const classes = useStyles();
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-9 col-lg-4 bg-white m-auto px-5 py-3">
          <h2 className="text-center mt-3">Sign up now</h2>
          <p className="text-center text-muted mb-4">
            Join our community and share knowledge with others!
          </p>
          <form>
            <Input type="text" placeholder="Username*" />
            <Input type="text" placeholder="Email*" />
            <Input type="text" placeholder="First Name" />
            <Input type="text" placeholder="Last Name" />
            <Input type="password" placeholder="Password*" />
            <Input type="password" placeholder="Confirm Password*" />
            <SubmitButton text="Register" />
            <p className="text-center">
              By clicking Register button you accept our{" "}
              <a className={classes.link} href="#">
                terms and conditions
              </a>
            </p>
            <p className="text-center">
              Already have an account?{" "}
              <a className={classes.link} href="#">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
