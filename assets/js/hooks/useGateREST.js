import React, { useState, useCallback } from "react";

const SEND_FETCH_URL = location.href;
const UPDATE_FETCH_URL = location.href;

function useGateREST(activeGateUuid) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const openGate = useCallback(async () => {
    setIsFetching(true);
    try {
      const fetchUrl = `${SEND_FETCH_URL}?gate_id=${activeGateUuid}`;
      const response = await fetch(fetchUrl, { method: "POST" });
      if (response.ok) {
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (Error) {
      setIsError(true);
    }
    setIsFetching(false);
  }, [activeGateUuid]);

  const updateGateStatus = useCallback(async () => {
    try {
      const fetchUrl = `${UPDATE_FETCH_URL}?gate_id=${activeGateUuid}`;
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      if (response.ok) {
        const json = await response.json();
        setRemainingTime(json);
      } else {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
    }
  }, [activeGateUuid]);

  return [remainingTime, isFetching, isError, openGate, updateGateStatus];
}

export default useGateREST;
