import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";

const HomePage = () => {
  const { user, isLoading } = useFetchUser();

  return (
    <>
      <Navbar user={user} isLoading={isLoading} />
    </>
  );
};

export default HomePage;
