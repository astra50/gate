import React, {useEffect, useState} from 'react';
import TextButton from '../text-button';
import ProgressBar from '../progress-bar';
import {GATE_INTERVAL, ENABLE_CLR, DISABLE_CLR, ALERTS} from '../../../options';
import {useAlert, useGateREST, useRemainingTimer} from '../../../hooks';
import Spinner from '../../spinner/spinner';
import './button-with-progress.less';

function ButtonWithProgress({
                              gate,
                              socketResponse,
                              isConnected,
                              isSocketError,
                            }) {
  const [timer, setTimer] = useState({seconds: 0});
  const [fetchResponse, isFetching, isFetchError, openGate, updateGateStatus] =
      useGateREST(gate.uuid);
  const timeRemaining = useRemainingTimer(timer);
  const alert = useAlert();

  const rotate = 360 * (1 - timeRemaining / GATE_INTERVAL);
  const isActive = (timeRemaining === 0) & isConnected;
  const isError = isSocketError || isFetchError;

  /**
   * @param socketResponse.gate_id
   * @param socketResponse.remaining_time
  **/

  useEffect(() => {
    if (gate.uuid === socketResponse.gate_id) {
      setTimer({seconds: socketResponse.remaining_time | 0});
    }
  }, [socketResponse]);

  useEffect(() => {
    setTimer({seconds: fetchResponse.remaining_time | 0});
  }, [fetchResponse]);

  useEffect(() => {
    if (!isConnected) {
      setTimer({seconds: 0});
    }
    if (isConnected) {
      updateGateStatus();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isFetchError && !isFetching) {
      alert.error(ALERTS.onSendError.alert);
      setTimer({ seconds: 10 });
    }
    if (!isFetchError && !isFetching) {
      alert.success(ALERTS.onResponse.alert);
    }
  }, [isFetchError, isFetching]);

  const handleClickGateButton = () => {
    if (!isActive) return;
    openGate();
  };

  return (
      <div className="button-with-progress">
        <TextButton
            className="button-with-progress__button-note"
            value={getText(
                gate,
                isConnected,
                isActive,
                isError,
                isFetching,
                timeRemaining,
            )}
            isActive={isActive}
            onClick={handleClickGateButton}
        />
        <ProgressBar
            className="button-with-progress__progress-bar"
            colors={getColors(isConnected, isActive, isError)}
            rotate={rotate}
            isActive={isActive}
        />
      </div>
  );
}

function getText(gate, isConnected, isActive, isError, isFetching, timeRemaining) {
  if (!isConnected || isFetching) return <Spinner/>;
  if (timeRemaining > 0) return timeRemaining;
  if (isActive && !isError) return gate.name.ru[0].toUpperCase() + gate.name.ru.slice(1);
  if (isActive && isError) return 'Повторить';
  return <Spinner/>;
}

function getColors(isConnected, isActive, isError) {
  const colors = {
    bar: ENABLE_CLR,
    shadow: ENABLE_CLR,
  };
  if (isConnected && isActive && !isError) {
    colors.bar = ENABLE_CLR;
    colors.shadow = ENABLE_CLR;
  } else if (!isConnected || isError) {
    colors.bar = DISABLE_CLR;
    colors.shadow = DISABLE_CLR;
  } else if (!isActive && isConnected && !isError) {
    colors.bar = ENABLE_CLR;
    colors.shadow = DISABLE_CLR;
  }
  return colors;
}

export default ButtonWithProgress;
