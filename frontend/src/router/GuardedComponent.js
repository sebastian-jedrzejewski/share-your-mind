import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

const GuardedComponent = ({ component: Component }) => {
  return isAuthenticated() === true ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default GuardedComponent;
