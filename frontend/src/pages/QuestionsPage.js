import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Questions } from "../components/questions/Questions";
import { SingleQuestion } from "../components/questions/SingleQuestion";
import ErrorModal from "../components/modals/ErrorModal";
import useShowError from "../hooks/useShowError";

export const QuestionsPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"questions-link"} />
      <Questions />
      <Footer />
    </>
  );
};

export const SingleQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"questions-link"} />
      <SingleQuestion />
      <Footer />
    </>
  );
};
