import React from 'react';
import './text-button.less'

const TextButton = ({isActive, value, onClick, className=''}) => {
  const styles = {
    fontSize: value.toString().length > 4 ? '0.2em' : '0.3em'
  }  
  return ( 
  <div className={`gate-button ${isActive ? 'gate-button--active' : ''} ${className}`} onClick={onClick} >
    <div className="gate-button__value" style={styles} >
      <span>{ value }</span>
    </div>
  </div>
  )
}

export default TextButton;
