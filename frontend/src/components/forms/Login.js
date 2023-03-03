import { Input, SubmitButton } from "./FormControls";

const Login = () => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-9 col-lg-4 bg-white m-auto px-5 py-3">
          <h2 className="text-center mt-3">Sign in now</h2>
          <p className="text-center text-muted mb-4">
            It's a good time to learn something new!
          </p>
          <form>
            <Input type="text" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <SubmitButton text="Login" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
