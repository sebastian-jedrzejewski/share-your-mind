import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import AskQuestionForm from "../components/forms/AskQuestionForm";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/Modals/ErrorModal";

const AskQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} />
      <AskQuestionForm />
      <Footer />
    </>
  );
};

export default AskQuestionPage;
