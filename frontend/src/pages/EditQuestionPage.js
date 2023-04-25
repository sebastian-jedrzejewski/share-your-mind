import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";
import EditQuestion from "../components/EditQuestion/EditQuestion";

const EditQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} />
      <EditQuestion />
      <Footer />
    </>
  );
};

export default EditQuestionPage;
