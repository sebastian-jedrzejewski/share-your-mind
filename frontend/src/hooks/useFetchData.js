import { useState, useEffect, useCallback } from "react";
import apiCall from "../api/axios";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const response = await apiCall.get(url);
    setData(response.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  return { data, isLoading };
};

export default useFetchData;
