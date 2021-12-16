import React from 'react'
import './progress-bar.less'

const ProgressBar = ({rotate, colors: {bar: backgroundColor, shadow}, className=''}) => {
  const lineStyle = {
    transform: `rotate(${rotate}deg)`, 
    backgroundColor,
  }
  const buttonStyle = {
    boxShadow: `${ shadow } 0px 0px 20px`
  }
  return (
      <div className={`progress-bar ${className} ${rotate > 180 && 'gt50'}`} style={buttonStyle}>
        <div className="_line" style={lineStyle} />
        <div className="_r-mask" style={rotate > 180? { backgroundColor } : {}} />
      </div>
    )
}

export default ProgressBar;
