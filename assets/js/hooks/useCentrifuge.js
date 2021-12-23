import React, { useState, useContext, useEffect } from "react";
import CentrifugeContext from "../context/centrifuge";

function useCentrifuge() {
  const [isError, setIsError] = useState();
  const [isConnected, setIsConnected] = useState();
  const [remainingTime, setRemainingTime] = useState({});
  const server = useContext(CentrifugeContext);

  useEffect(() => {
    server.onConnect = () => {
      setIsError(false);
      setIsConnected(true);
    };
    server.onDisconnect = () => {
      setIsConnected(false);
    };
    server.onReconnect = () => {
      setIsError(false);
      setIsConnected(true);
    };
    server.onResponse = (data) => {
      switch (data.open) {
        case "fail":
          setIsError(true);
          break;
        case "success":
          setIsError(false);
          setRemainingTime({ ...data });
          break;
        default:
          console.log("Непонятно");
      }
    };
    setIsConnected(false);
    setIsError(true);
    server.connect();
  }, []);

  return [remainingTime, isConnected, isError];
}

export default useCentrifuge;
