import { useContext, useMemo } from "react";
import AlertContext from "../../context/alert";

const useAlert = () => {
  const alertContext = useContext(AlertContext);
  const alert = useMemo(() => {
    return alertContext.current;
  }, []);
  return alert;
};

export default useAlert;
