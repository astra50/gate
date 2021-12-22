import React from 'react';
import './spinners.less'

function Spinner() {
  return (
    <div className="lds-roller" style={{background: '#f5f5f5'}}> 
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
    </div>
  )
}

export default Spinner;
