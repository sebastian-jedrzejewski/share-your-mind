import useFetchUser from "../hooks/useFetchUser";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ErrorModal from "../components/modals/ErrorModal";
import useShowError from "../hooks/useShowError";
import { BlogPosts } from "../components/blog_posts/BlogPosts";
import { SingleBlogPost } from "../components/blog_posts/SingleBlogPost";

export const BlogPostsPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"blogs-link"} />
      <BlogPosts />
      <Footer />
    </>
  );
};

export const SingleBlogPostPage = () => {
  const { user, isLoading } = useFetchUser();

  useShowError();

  return (
    <>
      <ErrorModal />
      <Navbar user={user} isLoading={isLoading} activeLink={"blogs-link"} />
      <SingleBlogPost />
      <Footer />
    </>
  );
};
