import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";
import EditPoll from "../components/EditPoll/EditPoll";

const EditPollPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"polls-link"} />
      <EditPoll />
      <Footer />
    </>
  );
};

export default EditPollPage;
