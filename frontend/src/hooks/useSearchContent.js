import { useState, useEffect, useCallback } from "react";
import apiCall from "../api/axios";

const useSearchContent = (searchData) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const search = useCallback(async () => {
    setIsLoading(true);
    const response = await apiCall.post("/api/v1/search/", { ...searchData });
    setData(response.data);
    setIsLoading(false);
  }, [searchData]);

  useEffect(() => {
    search();
  }, [searchData, search]);

  return { data, isLoading };
};

export default useSearchContent;
