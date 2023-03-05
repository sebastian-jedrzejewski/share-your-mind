import axios from "axios";
import apiCall from "../api/axios";

export const performAuthentication = (response) => {
  localStorage.setItem("access", response.data["access"]);
  localStorage.setItem("refresh", response.data["refresh"]);
};

export const performLogout = () => {
  apiCall
    .post("/auth/logout/", { refresh: localStorage.getItem("refresh") })
    .finally(() => {
      localStorage.clear();
      window.location.replace("/login");
      localStorage.setItem("wasLoggedOut", true);
    });
};

export const refreshToken = async () => {
  try {
    const response = await axios.post("/auth/jwt/refresh/", {
      refresh: localStorage.getItem("refresh"),
    });
    return response.data["access"];
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem("access") !== null;
};
