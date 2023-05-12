import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFetchUser from "../hooks/useFetchUser";
import useShowError from "../hooks/useShowError";
import ErrorModal from "../components/modals/ErrorModal";
import CreateBlogPostForm from "../components/forms/CreateBlogPostForm";

const CreateBlogPostPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"blogs-link"} />
      <CreateBlogPostForm />
      <Footer />
    </>
  );
};

export default CreateBlogPostPage;
