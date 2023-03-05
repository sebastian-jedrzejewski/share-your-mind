import { useState, useEffect, useCallback } from "react";
import apiCall from "../api/axios";
import { isAuthenticated } from "../auth/auth";

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      const response = await apiCall.get("/auth/users/me");
      setUser(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading };
};

export default useFetchUser;
