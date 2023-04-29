import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import AskQuestionForm from "../components/forms/AskQuestionForm";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";

const AskQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"questions-link"} />
      <AskQuestionForm />
      <Footer />
    </>
  );
};

export default AskQuestionPage;
