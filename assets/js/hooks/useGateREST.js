import React, { useState } from 'react';

const SEND_FETCH_URL = location.href
const UPDATE_FETCH_URL = location.href

function useGateREST() {
  const [remainingTime, setRemainingTime] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const openGate = async () => {
    setIsFetching(true)
    try {
      const response = await fetch(SEND_FETCH_URL, {method: 'POST'})
      if(response.ok) {
        setIsError(false)
      } else {
        setIsError(true)
      } 
    } catch (Error) {
      setIsError(true)
    }
    setIsFetching(false) 
  }
  const updateGateStatus = async () => {
    try {
      const response = await fetch(UPDATE_FETCH_URL, {method:"GET", headers: {'X-Requested-With': 'XMLHttpRequest'}})
      if (response.ok) {
        const json = await response.json()
        setRemainingTime(json)
      } else {
        setIsError(true)
      }
    } catch (e) {
      setIsError(true)
    }

  }
  return [
    remainingTime,
      isFetching,
      isError,
    openGate,
    updateGateStatus
  ]
}

export default useGateREST;
