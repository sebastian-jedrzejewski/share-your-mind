import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import AskQuestionForm from "../components/forms/AskQuestionForm";

const AskQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  return (
    <>
      <Navbar user={user} isLoading={isLoading} />
      <AskQuestionForm />
      <Footer />
    </>
  );
};

export default AskQuestionPage;
