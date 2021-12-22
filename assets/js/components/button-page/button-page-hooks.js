import React, {useEffect, useState} from 'react';
import { useCentrifuge, useGateREST } from '../../hooks';
import ButtonWithProgress from '../button';
import './button-page.less'

function ButtonPage() {
  const [timer, setTimer] = useState({ seconds: 0})
  const [socketResponse, isConnected, isSocketError] = useCentrifuge()
  const [fetchResponse, isFetching, isFetchError, openGate, updateGateStatus] = useGateREST()
  const handleClickGateButton = ()=> {
    openGate()
  }
  
  useEffect(()=>{
    setTimer({ seconds:socketResponse.remaining_time })
  }, [socketResponse] )

  useEffect(()=>{
    setTimer({ seconds:fetchResponse.remaining_time })
  }, [fetchResponse] )

  useEffect(()=>{
    if (!isConnected) setTimer({ seconds: 0})
    if (isConnected) updateGateStatus()
  }, [isConnected] )

  useEffect(() => {
    if (isFetchError & !isFetching) setTimer({ seconds: 10})
  }, [isFetchError, isFetching])

  return (
    <div className="button-page">
      <div className="button-page__logo">
        <img src="/img/astra_logo.png" alt="" className="button-page__logo-img" />
      </div>
      <ButtonWithProgress 
        timer={timer} 
        isConnected={isConnected} 
        isError={isSocketError || isFetchError} 
        isFetching={isFetching}
        handleClickGateButton={handleClickGateButton} 
      />
    </div>
  )
}

export default ButtonPage;
