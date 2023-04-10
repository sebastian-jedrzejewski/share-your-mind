import axios from "axios";
import { AUTH_TOKEN_HEADER } from "../constants/auth_constants";
import { performLogout, refreshToken } from "../auth/auth";

// apiCall is used for requests that requires user to be logged in
const apiCall = axios.create({
  baseURL: "http://localhost:8000/",
});

apiCall.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `${AUTH_TOKEN_HEADER} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiCall.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest.sent) {
      prevRequest.sent = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken != null) {
        prevRequest.headers[
          "Authorization"
        ] = `${AUTH_TOKEN_HEADER} ${newAccessToken}`;
        localStorage.setItem("access", newAccessToken);
      } else {
        performLogout();
      }
      return apiCall(prevRequest);
    } else if (
      (error?.response?.status >= 500 && error?.response?.status < 600) ||
      error?.response?.status == null
    ) {
      localStorage.setItem("somethingWentWrong", true);
    }
    return Promise.reject(error);
  }
);

export default apiCall;
