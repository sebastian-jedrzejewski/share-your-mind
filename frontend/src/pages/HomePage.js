import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import WelcomeContainer from "../components/containers/WelcomeContainer";
import Footer from "../components/Footer/Footer";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";

const HomePage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"home-link"} />
      <WelcomeContainer />
      <Footer />
    </>
  );
};

export default HomePage;
