import { useEffect } from "react";
import { showErrorModal } from "../components/Modals/ErrorModal";

const useShowError = () => {
  useEffect(() => {
    if (localStorage.getItem("somethingWentWrong") === "true") {
      showErrorModal();
      localStorage.setItem("somethingWentWrong", false);
    }
  }, [localStorage.getItem("somethingWentWrong")]);
};

export default useShowError;
