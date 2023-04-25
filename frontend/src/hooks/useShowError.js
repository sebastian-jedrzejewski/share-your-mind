import { useEffect } from "react";
import { showErrorModal } from "../components/modals/ErrorModal";

const useShowError = () => {
  let somethingWentWrong = localStorage.getItem("somethingWentWrong");

  useEffect(() => {
    if (localStorage.getItem("somethingWentWrong") === "true") {
      showErrorModal();
      localStorage.setItem("somethingWentWrong", false);
    }
  }, [somethingWentWrong]);
};

export default useShowError;
