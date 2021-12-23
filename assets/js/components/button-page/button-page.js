import React, { useEffect, useRef, useState } from "react";
import { useCentrifuge, useGateREST, useAlert } from "../../hooks";
import ButtonWithProgress from "../button";
import "./button-page.less";
import { ALERTS, GATES } from "../../options";
import GateSwitcher from "../gate-switcher";

function ButtonPage() {
  const [timer, setTimer] = useState({ seconds: 0 });
  const [activeGateUuid, setActiveGateUuid] = useState(GATES[0].uuid);
  const [socketResponse, isConnected, isSocketError] = useCentrifuge();
  const [fetchResponse, isFetching, isFetchError, openGate, updateGateStatus] =
    useGateREST(activeGateUuid);
  const alert = useAlert();
  const errorConnectionAlert = useRef();
  const isOneceConnected = useRef(false);

  const handleClickGateButton = () => {
    openGate();
  };

  useEffect(() => {
    const lastUsedGate = localStorage.getItem("lastUsedGate");
    if (lastUsedGate) setActiveGateUuid(lastUsedGate);
  }, []);

  useEffect(() => {
    localStorage.setItem("lastUsedGate", activeGateUuid);
    updateGateStatus();
  }, [activeGateUuid]);

  useEffect(() => {
    if (activeGateUuid === socketResponse.gate_id) {
      setTimer({ seconds: socketResponse.remaining_time | 0 });
    }
  }, [socketResponse]);

  useEffect(() => {
    setTimer({ seconds: fetchResponse.remaining_time | 0 });
  }, [fetchResponse]);

  useEffect(() => {
    if (!isConnected) {
      if (isOneceConnected.current) {
        errorConnectionAlert.current = alert.error(ALERTS.onDisconnect.alert, {
          timeout: 0,
        });
        setTimer({ seconds: 0 });
      }
    }
    if (isConnected) {
      errorConnectionAlert.current && errorConnectionAlert.current.remove();
      isOneceConnected.current && alert.info(ALERTS.onReconnect.alert);
      isOneceConnected.current = true;
      updateGateStatus();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isFetchError & !isFetching) {
      alert.error(ALERTS.onSendError.alert);
      setTimer({ seconds: 10 });
    }
    if (!isFetchError & !isFetching) {
      alert.success(ALERTS.onResponse.alert);
    }
  }, [isFetchError, isFetching]);

  return (
    <div className='button-page'>
      <div className='button-page__logo'>
        <img
          src='/img/astra_logo.png'
          alt=''
          className='button-page__logo-img'
        />
      </div>
      <GateSwitcher
        activeUuid={activeGateUuid}
        handelSwitchGate={setActiveGateUuid}
      />
      <ButtonWithProgress
        timer={timer}
        isConnected={isConnected}
        isError={isSocketError || isFetchError}
        isFetching={isFetching}
        handleClickGateButton={handleClickGateButton}
      />
    </div>
  );
}

export default ButtonPage;
