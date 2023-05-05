import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";
import CreatePollForm from "../components/forms/CreatePollForm";

const CreatePollPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"polls-link"} />
      <CreatePollForm />
      <Footer />
    </>
  );
};

export default CreatePollPage;
