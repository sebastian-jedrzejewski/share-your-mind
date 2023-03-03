import { createBrowserRouter } from "react-router-dom";
import LoginRegisterPage from "../pages/LoginRegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegisterPage />,
  },
]);

export default router;
