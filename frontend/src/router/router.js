import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { QuestionsPage, SingleQuestionPage } from "../pages/QuestionsPage";
import AskQuestionPage from "../pages/AskQuestionPage";
import GuardedComponent from "./GuardedComponent";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import EditProfilePage from "../pages/EditProfilePage";
import EditQuestionPage from "../pages/EditQuestionPage";
import GuardedAuthorComponent from "./GuardedAuthorComponent";
import { PollsPage, SinglePollPage } from "../pages/PollsPage";
import CreatePollPage from "../pages/CreatePollPage";
import EditPollPage from "../pages/EditPollPage";
import { BlogPostsPage, SingleBlogPostPage } from "../pages/BlogPostsPage";
import CreateBlogPostPage from "../pages/CreateBlogPostPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/questions",
    element: <QuestionsPage />,
  },
  {
    path: "/questions/:id",
    element: <SingleQuestionPage />,
  },
  {
    path: "/edit-question/:id",
    element: (
      <GuardedAuthorComponent
        component={EditQuestionPage}
        contentType="question"
      />
    ),
  },
  {
    path: "/ask-question",
    element: <GuardedComponent component={AskQuestionPage} />,
  },
  {
    path: "/edit-profile",
    element: <GuardedComponent component={EditProfilePage} />,
  },
  {
    path: "/polls",
    element: <GuardedComponent component={PollsPage} />,
  },
  {
    path: "/polls/:id",
    element: <GuardedComponent component={SinglePollPage} />,
  },
  {
    path: "/create-poll",
    element: <GuardedComponent component={CreatePollPage} />,
  },
  {
    path: "/edit-poll/:id",
    element: (
      <GuardedAuthorComponent component={EditPollPage} contentType="poll" />
    ),
  },
  {
    path: "/blog-posts",
    element: <GuardedComponent component={BlogPostsPage} />,
  },
  {
    path: "/blog-posts/:id",
    element: <GuardedComponent component={SingleBlogPostPage} />,
  },
  {
    path: "/create-blog-post",
    element: <GuardedComponent component={CreateBlogPostPage} />,
  },
]);

export default router;
