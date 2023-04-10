import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/Modals/ErrorModal";
import Login from "../components/forms/Login";

const LoginPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} />
      <Login />
      <Footer />
    </>
  );
};

export default LoginPage;
