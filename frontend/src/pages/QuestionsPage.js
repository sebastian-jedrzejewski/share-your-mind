import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Questions } from "../components/questions/Questions";
import { SingleQuestion } from "../components/questions/SingleQuestion";

export const QuestionsPage = () => {
  const { user, isLoading } = useFetchUser();

  return (
    <>
      <Navbar user={user} isLoading={isLoading} />
      <Questions />
      <Footer />
    </>
  );
};

export const SingleQuestionPage = () => {
  const { user, isLoading } = useFetchUser();

  return (
    <>
      <Navbar user={user} isLoading={isLoading} />
      <SingleQuestion />
      <Footer />
    </>
  );
};