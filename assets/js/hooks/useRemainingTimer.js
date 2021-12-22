import React, {useState, useRef, useEffect} from 'react';

function useRemainingTimer(init) {
  const [timeRemaining, setTimeRemaining] = useState(init.seconds)
  const acitiveTimerId = useRef()
  
  useEffect(() => {
    const startTime = new Date()
    setTimeRemaining(init.seconds)
    if (init.seconds <= 0) {
      return timeRemaining
    }
    acitiveTimerId.current = setInterval(() => {
      const timeRemaining = parseInt(init.seconds - (new Date() - startTime)/1000)
      setTimeRemaining(timeRemaining)
    }, 1000)  
    return () => {
      clearInterval(acitiveTimerId.current)
    }
  }, [init])

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearInterval(acitiveTimerId.current)
    }
  }, [timeRemaining])

  return timeRemaining
}

export default useRemainingTimer;
