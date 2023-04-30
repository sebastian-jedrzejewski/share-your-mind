import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { SingleQuestion } from "../components/questions/SingleQuestion";
import ErrorModal from "../components/modals/ErrorModal";
import useShowError from "../hooks/useShowError";
import { Polls } from "../components/polls/Polls";

export const PollsPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"questions-link"} />
      <Polls />
      <Footer />
    </>
  );
};

export const SinglePollPage = () => {
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
