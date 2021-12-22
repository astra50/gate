import React from 'react';
import TextButton from '../text-button';
import ProgressBar from '../progress-bar';
import { GATE_INTERVAL, ENABLE_CLR, DISABLE_CLR } from '../../../options';
import { useRemainingTimer } from '../../../hooks';
import Spinner from '../../spinner/spinner';

function ButtonWithProgress({ timer, handleClickGateButton, isConnected, isError, isFetching }) {
  const timeRemaining = useRemainingTimer(timer)
  const rotate = 360 * (1 - timeRemaining/GATE_INTERVAL)
  const isActive = timeRemaining == 0 & isConnected
  
  const onClick = () => {
    if (!isActive) return 
    handleClickGateButton()
  }

  return (
    <div className="button-page__button"> 
      <TextButton className="button-page__button-note" 
        value={ getText(isConnected, isActive, isError, isFetching, timeRemaining) } 
        isActive={ isActive } 
        onClick={ onClick } />
      <ProgressBar className="button-page__progress-bar"
        colors={ getColors(isConnected, isActive, isError) } 
        rotate={ rotate } 
        isActive={ isActive } />
    </div>
  )
}

function getText(isConnected, isActive, isError, isFetching, timeRemaining) {
  if (!isConnected || isFetching) return <Spinner />
  if (timeRemaining > 0) return timeRemaining
  if (isActive & !isError) return 'Открыть'
  if (isActive & isError) return 'Повторить'
  return 'Спиннер'
}

function getColors(isConnected, isActive, isError) {
  const colors = {
    bar: ENABLE_CLR,
    shadow: ENABLE_CLR
  }
  if (isConnected & isActive & !isError) {
    colors.bar = ENABLE_CLR
    colors.shadow = ENABLE_CLR
  } else if (!isConnected | isError) {
    colors.bar = DISABLE_CLR
    colors.shadow = DISABLE_CLR
  } else if (!isActive & isConnected & !isError) {
    colors.bar = ENABLE_CLR
    colors.shadow = DISABLE_CLR
  }
  return colors
}

export default ButtonWithProgress;
