import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../components/forms/Login";
import Register from "../components/forms/Register";
import { QuestionsPage, SingleQuestionPage } from "../pages/QuestionsPage";
import AskQuestionPage from "../pages/AskQuestionPage";
import GuardedComponent from "./GuardedComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
