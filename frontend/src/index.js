import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.css";

import reportWebVitals from "./reportWebVitals";

import { RouterProvider } from "react-router-dom";
import router from "./router/router";

document.body.classList.add("body");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
