import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { QuestionsPage, SingleQuestionPage } from "../pages/QuestionsPage";
import AskQuestionPage from "../pages/AskQuestionPage";
import GuardedComponent from "./GuardedComponent";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

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
    path: "/ask-question",
    element: <GuardedComponent component={AskQuestionPage} />,
  },
]);

export default router;
