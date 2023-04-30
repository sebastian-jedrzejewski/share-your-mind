import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ErrorModal from "../components/modals/ErrorModal";
import useShowError from "../hooks/useShowError";
import { Polls } from "../components/polls/Polls";
import { SinglePoll } from "../components/polls/SinglePoll";

export const PollsPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"polls-link"} />
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
      <Navbar user={user} isLoading={isLoading} activeLink={"polls-link"} />
      <SinglePoll />
      <Footer />
    </>
  );
};
