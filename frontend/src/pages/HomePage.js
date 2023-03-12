import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import WelcomeContainer from "../components/containers/WelcomeContainer";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  const { user, isLoading } = useFetchUser();

  return (
    <>
      <Navbar user={user} isLoading={isLoading} />
      <WelcomeContainer />
      <Footer />
    </>
  );
};

export default HomePage;
