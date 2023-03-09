import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import reportWebVitals from "./reportWebVitals";

import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import axios from "axios";

document.body.classList.add("body");

// axios config
axios.defaults.baseURL = "http://localhost:8000/";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
