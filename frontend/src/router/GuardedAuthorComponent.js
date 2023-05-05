import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";
import useFetchData from "../hooks/useFetchData";
import useFetchUser from "../hooks/useFetchUser";

const GuardedAuthorComponent = ({ component: Component, contentType }) => {
  const { id } = useParams();
  const { data, isLoading: isLoading1 } = useFetchData(
    `/api/v1/${contentType}s/${id}/`
  );
  const { user, isLoading: isLoading2 } = useFetchUser();

  if (isLoading1 || isLoading2) {
    return null;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (data?.author?.username !== user?.username) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default GuardedAuthorComponent;
