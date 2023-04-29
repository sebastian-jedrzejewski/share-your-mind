import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";
import Register from "../components/forms/Register";

const RegisterPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} />
      <Register />
      <Footer />
    </>
  );
};

export default RegisterPage;
