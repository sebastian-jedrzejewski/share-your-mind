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
]);

export default router;
