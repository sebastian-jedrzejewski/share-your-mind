import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../components/forms/Login";
import Register from "../components/forms/Register";

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
]);

export default router;
